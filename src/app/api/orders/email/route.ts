import { NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/src/lib/emailService'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await sendOrderConfirmationEmail(body)
    return NextResponse.json({ success: true, ...result })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to send order email' },
      { status: 500 }
    )
  }
}
