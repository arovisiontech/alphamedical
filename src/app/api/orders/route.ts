import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json')
const tmpFilePath = path.join(os.tmpdir(), 'alpha_orders.json')

const g = globalThis as unknown as {
  __alpha_orders?: any[]
}

function getOrdersFromFile(): any[] {
  if (g.__alpha_orders !== undefined && Array.isArray(g.__alpha_orders)) {
    return g.__alpha_orders
  }

  for (const filePath of [dataFilePath, tmpFilePath]) {
    try {
      if (fs.existsSync(filePath)) {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        if (Array.isArray(parsed)) {
          g.__alpha_orders = parsed
          return parsed
        }
      }
    } catch (e) {}
  }

  g.__alpha_orders = []
  return []
}

function saveOrdersToFile(orders: any[]): void {
  g.__alpha_orders = orders

  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2), 'utf-8')
  } catch (e) {}

  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify(orders, null, 2), 'utf-8')
  } catch (e) {}
}

export async function GET() {
  const orders = getOrdersFromFile()
  return NextResponse.json(orders, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const current = getOrdersFromFile()

    if (body?.action === 'replace' && Array.isArray(body.orders)) {
      saveOrdersToFile(body.orders)
      return NextResponse.json({ success: true, orders: body.orders })
    }

    if (body?.action === 'update_status' && body.id && body.status) {
      const updated = current.map((o: any) =>
        o.id === body.id ? { ...o, status: body.status } : o
      )
      saveOrdersToFile(updated)
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
      saveOrdersToFile(updated)
      return NextResponse.json({ success: true, orders: updated })
    }

    const orderRecord = body?.order || body
    if (!orderRecord || !orderRecord.id) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
    }

    const filtered = current.filter((o: any) => o.id !== orderRecord.id)
    const updated = [orderRecord, ...filtered]
    saveOrdersToFile(updated)

    return NextResponse.json({ success: true, order: orderRecord })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save order' },
      { status: 500 }
    )
  }
}
