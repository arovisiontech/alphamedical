import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getOrdersFromDisk, saveOrdersToDisk } from '@/src/lib/ordersStore'
import { sendOrderCancellationEmail } from '@/src/lib/emailService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, orderRef, reason, order: fallbackOrder } = body

    const targetId = String(id || orderRef || fallbackOrder?.id || '').trim()
    if (!targetId) {
      return NextResponse.json({ error: 'Order ID is required.' }, { status: 400 })
    }

    const altId = targetId.replace('ALPH-', 'ORD-')
    const current = getOrdersFromDisk()
    let targetOrder =
      current.find(
        (o: any) => o.id === targetId || o.id === altId || o.orderRef === targetId
      ) || fallbackOrder

    if (!targetOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 })
    }

    if (targetOrder.status === 'Cancelled') {
      return NextResponse.json({
        success: true,
        alreadyCancelled: true,
        order: targetOrder,
      })
    }

    const cancelReason = (reason || 'Cancelled via website').trim()
    let stripeRefundId: string | undefined = targetOrder.stripeRefundId
    let refundStatus = 'Cancelled (No Stripe Payment Attached)'

    const paymentIntentId = targetOrder.stripePaymentIntentId
    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()

    if (paymentIntentId && stripeSecretKey && stripeSecretKey !== 'sk_test_placeholder') {
      const stripe = new Stripe(stripeSecretKey)
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId)

      if (pi.status === 'succeeded') {
        const refund = await stripe.refunds.create({
          payment_intent: pi.id,
          reason: 'requested_by_customer',
          metadata: {
            order_ref: targetOrder.orderRef || targetOrder.id,
            cancel_reason: cancelReason.slice(0, 450),
          },
        })
        stripeRefundId = refund.id
        refundStatus = `Refunded via Stripe (${refund.status || 'succeeded'})`
      } else if (
        ['requires_payment_method', 'requires_capture', 'requires_confirmation', 'requires_action', 'processing'].includes(
          pi.status
        )
      ) {
        await stripe.paymentIntents.cancel(pi.id, {
          cancellation_reason: 'requested_by_customer',
        })
        refundStatus = 'Stripe PaymentIntent Cancelled'
      } else if (pi.status === 'canceled') {
        refundStatus = 'Already Cancelled on Stripe'
      }
    }

    const cancelledAt = new Date().toISOString()
    const updatedOrder = {
      ...targetOrder,
      status: 'Cancelled',
      paymentStatus: stripeRefundId ? 'Refunded' : 'Cancelled',
      stripeRefundId,
      refundStatus,
      cancelReason,
      cancelledAt,
    }

    const filtered = current.filter((o: any) => o.id !== updatedOrder.id)
    saveOrdersToDisk([updatedOrder, ...filtered])

    const emailResult = await sendOrderCancellationEmail({
      orderRef: updatedOrder.orderRef || updatedOrder.id,
      customerName: updatedOrder.customerName || 'Valued Customer',
      customerEmail: updatedOrder.customerEmail || '',
      items: updatedOrder.items || [],
      subtotal: updatedOrder.subtotal,
      shipping: updatedOrder.shipping,
      tax: updatedOrder.tax,
      total: Number(updatedOrder.total || 0),
      cancelReason,
      refundStatus,
      stripeRefundId,
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      stripeRefundId,
      refundStatus,
      emailResult,
    })
  } catch (err: any) {
    console.error('Order Cancel + Stripe Refund Error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to cancel and refund order on Stripe.' },
      { status: 500 }
    )
  }
}
