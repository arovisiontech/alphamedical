import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, customer, shippingAddress, shippingCost, discountAmount, orderRef } = body

    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()

    if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder') {
      return NextResponse.json(
        {
          error:
            'Stripe Secret Key is missing or still set to placeholder. Add your live STRIPE_SECRET_KEY (sk_live_...) in environment variables.',
        },
        { status: 500 }
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
    }

    const round2 = (n: number) => Math.round((Number(n) || 0) * 100) / 100

    const subTotal = round2(
      items.reduce((acc: number, it: any) => {
        const unit = round2(Number(it.price) || 0)
        const qty = Math.max(1, Number(it.quantity) || 1)
        return acc + round2(unit * qty)
      }, 0)
    )

    const shipping = Math.max(0, round2(Number(shippingCost) || 0))
    const discount = Math.min(Math.max(0, round2(Number(discountAmount) || 0)), round2(subTotal + shipping))
    const grandTotal = Math.max(0, round2(subTotal + shipping - discount))
    const amountInCents = Math.round(grandTotal * 100)

    if (amountInCents < 50) {
      return NextResponse.json(
        { error: 'Minimum card charge amount is $0.50 USD.' },
        { status: 400 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)
    const referenceId = orderRef || `ALPH-${Math.floor(100000 + Math.random() * 900000)}`
    const fullName = `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Customer'
    const itemsSummary = items
      .map((it: any) => `${Math.max(1, Number(it.quantity) || 1)}x ${it.title || 'Instrument'}`)
      .join(', ')
      .slice(0, 450)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      receipt_email: customer?.email || undefined,
      description: `Alpha Medical Supplies Order ${referenceId} — ${itemsSummary}`,
      shipping: {
        name: fullName,
        phone: customer?.phone || undefined,
        address: {
          line1: shippingAddress?.address || '',
          line2: shippingAddress?.address2 || undefined,
          city: shippingAddress?.city || '',
          state: shippingAddress?.region || '',
          postal_code: shippingAddress?.postCode || '',
          country: 'US',
        },
      },
      metadata: {
        order_ref: referenceId,
        customer_name: fullName,
        customer_email: customer?.email || '',
        customer_phone: customer?.phone || '',
        customer_company: customer?.company || '',
        subtotal_usd: subTotal.toFixed(2),
        shipping_usd: shipping.toFixed(2),
        discount_usd: discount.toFixed(2),
        total_usd: grandTotal.toFixed(2),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: grandTotal,
      livemode: paymentIntent.livemode,
    })
  } catch (error: any) {
    console.error('Stripe PaymentIntent Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize card payment with Stripe.' },
      { status: 500 }
    )
  }
}
