import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getOrdersFromDisk, saveOrdersToDisk } from '@/src/lib/ordersStore'
import { sendOrderCancellationEmail } from '@/src/lib/emailService'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const sig = req.headers.get('stripe-signature')
    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()
    const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET || '').trim()

    let event: Stripe.Event

    if (webhookSecret && sig && stripeSecretKey) {
      const stripe = new Stripe(stripeSecretKey)
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
    } else {
      event = JSON.parse(rawBody) as Stripe.Event
    }

    if (event.type === 'charge.refunded' || event.type === 'payment_intent.canceled') {
      const obj: any = event.data.object
      const paymentIntentId =
        event.type === 'charge.refunded' ? obj.payment_intent : obj.id
      const orderRefMeta = obj.metadata?.order_ref

      const current = getOrdersFromDisk()
      let matchedOrder: any = null

      const updatedOrders = current.map((o: any) => {
        const isMatch =
          (paymentIntentId && o.stripePaymentIntentId === paymentIntentId) ||
          (orderRefMeta && (o.orderRef === orderRefMeta || o.id === orderRefMeta.replace('ALPH-', 'ORD-')))

        if (!isMatch) return o

        const refundId =
          event.type === 'charge.refunded'
            ? obj.refunds?.data?.[0]?.id || o.stripeRefundId
            : o.stripeRefundId

        const nextOrder = {
          ...o,
          status: 'Cancelled',
          paymentStatus: event.type === 'charge.refunded' ? 'Refunded' : 'Cancelled',
          stripeRefundId: refundId,
          refundStatus:
            event.type === 'charge.refunded'
              ? 'Refunded via Stripe Dashboard'
              : 'Cancelled via Stripe Dashboard',
          cancelReason: o.cancelReason || 'Cancelled/Refunded in Stripe Dashboard',
          cancelledAt: o.cancelledAt || new Date().toISOString(),
        }
        matchedOrder = nextOrder
        return nextOrder
      })

      if (matchedOrder) {
        saveOrdersToDisk(updatedOrders)
        await sendOrderCancellationEmail({
          orderRef: matchedOrder.orderRef || matchedOrder.id,
          customerName: matchedOrder.customerName || 'Valued Customer',
          customerEmail: matchedOrder.customerEmail || '',
          items: matchedOrder.items || [],
          subtotal: matchedOrder.subtotal,
          shipping: matchedOrder.shipping,
          tax: matchedOrder.tax,
          total: Number(matchedOrder.total || 0),
          cancelReason: matchedOrder.cancelReason,
          refundStatus: matchedOrder.refundStatus,
          stripeRefundId: matchedOrder.stripeRefundId,
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Stripe Webhook Error:', err?.message)
    return NextResponse.json(
      { error: err?.message || 'Webhook error' },
      { status: 400 }
    )
  }
}
