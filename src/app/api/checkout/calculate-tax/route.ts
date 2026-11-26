import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { calculateStripeAutomaticTax, round2 } from '@/src/lib/stripeTax'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, shippingCost = 0, discountAmount = 0, shippingAddress = {} } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({
        taxAmount: 0,
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        pendingAddress: true,
      })
    }

    const subtotal = round2(
      items.reduce(
        (acc: number, it: any) =>
          acc + round2((Number(it.price) || 0) * Math.max(1, Number(it.quantity) || 1)),
        0
      )
    )
    const shipping = Math.max(0, round2(Number(shippingCost) || 0))
    const discount = Math.min(Math.max(0, round2(Number(discountAmount) || 0)), round2(subtotal + shipping))
    const baseTotal = Math.max(0, round2(subtotal + shipping - discount))

    const postalCode = (shippingAddress?.postCode || '').trim()
    if (postalCode.length < 5) {
      return NextResponse.json({
        taxAmount: 0,
        subtotal,
        shipping,
        discount,
        total: baseTotal,
        pendingAddress: true,
      })
    }

    const stripeSecretKey = (process.env.STRIPE_SECRET_KEY || '').trim()
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_placeholder') {
      return NextResponse.json({
        taxAmount: 0,
        subtotal,
        shipping,
        discount,
        total: baseTotal,
        pendingAddress: true,
      })
    }

    const stripe = new Stripe(stripeSecretKey)
    const result = await calculateStripeAutomaticTax(stripe, {
      items,
      shippingCost: shipping,
      discountAmount: discount,
      shippingAddress,
    })

    return NextResponse.json({
      ...result,
      pendingAddress: false,
    })
  } catch (error: any) {
    console.warn('Stripe Automatic Tax Preview Error:', error?.message)
    return NextResponse.json(
      {
        error: error?.message || 'Unable to calculate tax for this address.',
        taxAmount: 0,
        pendingAddress: true,
      },
      { status: 200 }
    )
  }
}
