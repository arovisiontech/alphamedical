import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, customer, shippingAddress, shippingCost, discountAmount, orderRef } = body

    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe Secret Key is missing in environment variables (.env / .env.local).' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)

    const host = req.headers.get('host') || 'alphasurgical.brandiedesign.agency'
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const origin = req.headers.get('origin') || `${protocol}://${host}`

    // Build line items array
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        const unitPrice = Math.max(0.5, Number(it.price) || 50)
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: it.title || 'Alpha Surgical Instrument',
              description: it.sku ? `SKU: ${it.sku}` : 'Medical Grade Stainless Steel Instrument',
              images:
                it.featured_image && it.featured_image.startsWith('http')
                  ? [it.featured_image]
                  : undefined,
            },
            unit_amount: Math.round(unitPrice * 100),
          },
          quantity: Math.max(1, Number(it.quantity) || 1),
        })
      }
    } else {
      // Fallback single item
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'ALPHA Medical Surgical Instruments Order',
            description: 'Custom Order Delivery',
          },
          unit_amount: 5500, // $55.00
        },
        quantity: 1,
      })
    }

    // Add shipping as line item
    const parsedShipping = Number(shippingCost) || 0
    if (parsedShipping > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Fast International Express Shipping',
            description: 'Insured worldwide medical delivery with tracking',
          },
          unit_amount: Math.round(parsedShipping * 100),
        },
        quantity: 1,
      })
    }

    const referenceId = orderRef || `ALPH-${Math.floor(100000 + Math.random() * 900000)}`

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: customer?.email || undefined,
      client_reference_id: referenceId,
      metadata: {
        order_ref: referenceId,
        customer_name: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim(),
        customer_phone: customer?.phone || '',
        customer_company: customer?.company || '',
        customer_address: `${shippingAddress?.address || ''}, ${shippingAddress?.city || ''}, ${shippingAddress?.country || ''}`,
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_ref=${referenceId}`,
      cancel_url: `${origin}/checkout?canceled=true&order_ref=${referenceId}`,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id, orderRef: referenceId })
  } catch (error: any) {
    console.error('Stripe Checkout Session Error:', error)
    return NextResponse.json(
      { error: error.message || 'Stripe payment initialization failed' },
      { status: 500 }
    )
  }
}
