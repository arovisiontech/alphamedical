import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export interface StoreReviewItem {
  id: string
  author: string
  hospital?: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  productSku?: string
  productTitle?: string
  orderRef?: string
}

const INITIAL_REVIEWS_SEED: StoreReviewItem[] = [
  {
    id: 'rev-seed-1',
    author: 'Dr. David Miller, MD',
    hospital: "St. Luke's Surgical Hospital, FL",
    rating: 5,
    title: 'Outstanding German-grade precision and grip',
    comment:
      'Used during high-precision surgical procedures. The balance and electropolished satin finish completely eliminate glare under OR lamps. Highly recommended.',
    date: 'November 18, 2026',
    verified: true,
    productTitle: 'Hartmann Dressing Forceps',
    productSku: 'SKU-4500',
  },
  {
    id: 'rev-seed-2',
    author: 'Sarah Jenkins, RN',
    hospital: 'Metro Health OR Logistics',
    rating: 5,
    title: 'Durable across 60+ autoclave sterilization cycles',
    comment:
      'Passed over 60 autoclave sterilization cycles at 134°C with zero discoloration or rust. Very smooth action and fast nationwide delivery.',
    date: 'November 10, 2026',
    verified: true,
    productTitle: 'Super Cut Plastic Reconstructive Scissors',
    productSku: 'SKU-2001',
  },
  {
    id: 'rev-seed-3',
    author: 'Dr. Michael Vance, FACS',
    hospital: 'Carolina Regional Orthopedics',
    rating: 5,
    title: 'Superb quality at competitive wholesale prices',
    comment:
      'Excellent craftsmanship and feel. Meets all US hospital compliance standards. Checkout and card payment were seamless.',
    date: 'October 29, 2026',
    verified: true,
    productTitle: 'Mayo-Hegar Needle Holders TC Inserts',
    productSku: 'SKU-1001',
  },
]

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'reviews.json')
const tmpFilePath = path.join(os.tmpdir(), 'alpha_reviews.json')

const g = globalThis as unknown as {
  __alpha_reviews?: StoreReviewItem[]
}

function getReviewsFromFile(): StoreReviewItem[] {
  if (g.__alpha_reviews !== undefined && Array.isArray(g.__alpha_reviews)) {
    return g.__alpha_reviews
  }

  for (const filePath of [dataFilePath, tmpFilePath]) {
    try {
      if (fs.existsSync(filePath)) {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        if (Array.isArray(parsed) && parsed.length > 0) {
          g.__alpha_reviews = parsed
          return parsed
        }
      }
    } catch (e) {}
  }

  g.__alpha_reviews = INITIAL_REVIEWS_SEED
  return INITIAL_REVIEWS_SEED
}

function saveReviewsToFile(reviews: StoreReviewItem[]): void {
  g.__alpha_reviews = reviews

  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(reviews, null, 2), 'utf-8')
  } catch (e) {}

  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify(reviews, null, 2), 'utf-8')
  } catch (e) {}
}

export async function GET() {
  const reviews = getReviewsFromFile()
  return NextResponse.json(reviews, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const review = body?.review || body

    if (!review || !review.author || !review.comment) {
      return NextResponse.json({ error: 'Author and comment are required' }, { status: 400 })
    }

    const current = getReviewsFromFile()
    const newItem: StoreReviewItem = {
      id: review.id || `rev-${Date.now()}`,
      author: String(review.author).trim(),
      hospital: review.hospital ? String(review.hospital).trim() : 'Verified USA Store Buyer',
      rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
      title: review.title ? String(review.title).trim() : 'Verified Customer Review',
      comment: String(review.comment).trim(),
      date:
        review.date ||
        new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      verified: review.verified !== false,
      productSku: review.productSku,
      productTitle: review.productTitle,
      orderRef: review.orderRef,
    }

    const filtered = current.filter((r) => r.id !== newItem.id)
    const updated = [newItem, ...filtered]
    saveReviewsToFile(updated)

    return NextResponse.json({ success: true, review: newItem, reviews: updated })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to save review' },
      { status: 500 }
    )
  }
}
