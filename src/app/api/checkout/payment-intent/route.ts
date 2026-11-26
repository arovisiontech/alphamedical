import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { calculateStripeAutomaticTax, normalizeUsStateCode, round2 } from '@/src/lib/stripeTax'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, customer, shippingAddress, shippingCost, discountAmount, orderRef } = body

    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()

    if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder') {
      return NextResponse.json(
        {
          error:
            'Stripe Secret Key is missing or still set to placeholder. Add your live STRIPE_SECRET_KEY in environment variables.',
        },
        { status: 500 }
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 })
    }

    const postalCode = (shippingAddress?.postCode || '').trim()
    if (postalCode.length < 5) {
      return NextResponse.json(
        { error: 'Please enter a valid 5-digit US Postal / ZIP Code for automatic tax calculation.' },
        { status: 400 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)

    const taxResult = await calculateStripeAutomaticTax(stripe, {
      items,
      shippingCost: Number(shippingCost) || 0,
      discountAmount: Number(discountAmount) || 0,
      shippingAddress: shippingAddress || {},
    })

    if (taxResult.amountInCents < 50) {
      return NextResponse.json(
        { error: 'Minimum card charge amount is $0.50 USD.' },
        { status: 400 }
      )
    }

    const referenceId = orderRef || `ALPH-${Math.floor(100000 + Math.random() * 900000)}`
    const fullName = `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Customer'
    const itemsSummary = items
      .map((it: any) => `${Math.max(1, Number(it.quantity) || 1)}x ${it.title || 'Instrument'}`)
      .join(', ')
      .slice(0, 450)

    const stateCode = normalizeUsStateCode(shippingAddress?.region)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: taxResult.amountInCents,
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
          state: stateCode || shippingAddress?.region || '',
          postal_code: postalCode,
          country: 'US',
        },
      },
      metadata: {
        order_ref: referenceId,
        tax_strategy: 'stripe_automatic_tax',
        tax_behavior: 'exclusive',
        tax_calculation_id: taxResult.calculationId,
        customer_name: fullName,
        customer_email: customer?.email || '',
        customer_phone: customer?.phone || '',
        customer_company: customer?.company || '',
        subtotal_usd: taxResult.subtotal.toFixed(2),
        shipping_usd: taxResult.shipping.toFixed(2),
        discount_usd: taxResult.discount.toFixed(2),
        tax_usd: taxResult.taxAmount.toFixed(2),
        total_usd: taxResult.total.toFixed(2),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      calculationId: taxResult.calculationId,
      subtotal: taxResult.subtotal,
      shipping: taxResult.shipping,
      discount: taxResult.discount,
      taxAmount: taxResult.taxAmount,
      amount: round2(taxResult.total),
      taxBreakdown: taxResult.taxBreakdown,
      livemode: paymentIntent.livemode,
    })
  } catch (error: any) {
    console.error('Stripe PaymentIntent + Automatic Tax Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize card payment with Stripe Automatic Tax.' },
      { status: 500 }
    )
  }
}
