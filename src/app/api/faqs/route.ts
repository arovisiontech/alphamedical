import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'faqs.json')

export interface FaqItemRecord {
  id: string
  category: string
  question: string
  answer: string
}

function getStoredFaqsFromFile(): FaqItemRecord[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error('[API /api/faqs] Error reading faqs file:', err)
  }
  return []
}

function saveFaqsToFile(faqs: FaqItemRecord[]): boolean {
  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(faqs, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('[API /api/faqs] Error writing faqs file:', err)
    return false
  }
}

export async function GET(req: NextRequest) {
  const faqs = getStoredFaqsFromFile()
  return NextResponse.json(faqs, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let updatedFaqs: FaqItemRecord[] = []

    if (Array.isArray(body)) {
      updatedFaqs = body
    } else if (body && body.action === 'delete' && body.id) {
      const current = getStoredFaqsFromFile()
      updatedFaqs = current.filter((f) => f.id !== body.id)
    } else if (body && body.action === 'saveSingle' && body.faq) {
      const current = getStoredFaqsFromFile()
      const exists = current.some((f) => f.id === body.faq.id)
      if (exists) {
        updatedFaqs = current.map((f) => (f.id === body.faq.id ? body.faq : f))
      } else {
        updatedFaqs = [body.faq, ...current]
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    const saved = saveFaqsToFile(updatedFaqs)
    if (!saved) {
      return NextResponse.json({ success: false, error: 'Disk write failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      count: updatedFaqs.length,
      faqs: updatedFaqs,
    })
  } catch (err: any) {
    console.error('[API /api/faqs POST Error]:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
