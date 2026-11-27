import { NextRequest, NextResponse } from 'next/server'
import { getOrdersFromDisk, saveOrdersToDisk } from '@/src/lib/ordersStore'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const orders = getOrdersFromDisk()
  return NextResponse.json(orders, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const current = getOrdersFromDisk()

    if (body?.action === 'replace' && Array.isArray(body.orders)) {
      saveOrdersToDisk(body.orders)
      return NextResponse.json({ success: true, orders: body.orders })
    }

    if (body?.action === 'update_status' && body.id && body.status) {
      const updated = current.map((o: any) =>
        o.id === body.id ? { ...o, status: body.status } : o
      )
      saveOrdersToDisk(updated)
      return NextResponse.json({ success: true, orders: updated })
    }

    if (body?.action === 'cancel_order' && body.id) {
      const targetId = String(body.id)
      const altId = targetId.replace('ALPH-', 'ORD-')
      const updated = current.map((o: any) =>
        o.id === targetId || o.id === altId || o.orderRef === targetId
          ? {
              ...o,
              status: 'Cancelled',
              paymentStatus: o.paymentStatus || 'Cancelled / Refunded',
              cancelReason: body.reason || 'Cancelled by customer',
              cancelledAt: new Date().toISOString(),
            }
          : o
      )
      saveOrdersToDisk(updated)
      return NextResponse.json({ success: true, orders: updated })
    }

    if (body?.action === 'update_rating' && body.id) {
      const updated = current.map((o: any) =>
        o.id === body.id || o.id === body.id.replace('ALPH-', 'ORD-')
          ? {
              ...o,
              rating: body.rating ?? o.rating,
              reviewComment: body.reviewComment ?? o.reviewComment,
            }
          : o
      )
      saveOrdersToDisk(updated)
      return NextResponse.json({ success: true, orders: updated })
    }

    const orderRecord = body?.order || body
    if (!orderRecord || !orderRecord.id) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
    }

    const filtered = current.filter((o: any) => o.id !== orderRecord.id)
    const updated = [orderRecord, ...filtered]
    saveOrdersToDisk(updated)

    return NextResponse.json({ success: true, order: orderRecord })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save order' },
      { status: 500 }
    )
  }
}
