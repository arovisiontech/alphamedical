import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 })
    }

    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe Secret Key is missing in environment variables.' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey)

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    })

    return NextResponse.json({
      success: true,
      paid: session.payment_status === 'paid',
      status: session.status,
      customer_email: session.customer_email || session.customer_details?.email,
      customer_name: session.customer_details?.name,
      amount_total: session.amount_total ? session.amount_total / 100 : 0,
      currency: session.currency?.toUpperCase() || 'USD',
      order_ref: session.client_reference_id || session.metadata?.order_ref,
      metadata: session.metadata,
      created_at: new Date(session.created * 1000).toISOString(),
    })
  } catch (error: any) {
    console.error('Stripe Verify Error:', error)
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 })
  }
}
