import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { BannerItem } from '@/src/types/banner'

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'banners.json')

function getStoredBannersFromFile(): BannerItem[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error('[API /api/banners] Error reading banners file:', err)
  }
  return []
}

function saveBannersToFile(banners: BannerItem[]): boolean {
  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(banners, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('[API /api/banners] Error writing banners file:', err)
    return false
  }
}

export async function GET(req: NextRequest) {
  const banners = getStoredBannersFromFile()
  return NextResponse.json(banners, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let updated: BannerItem[] = []

    if (Array.isArray(body)) {
      updated = body
    } else if (body && body.action === 'delete' && body.id) {
      const current = getStoredBannersFromFile()
      updated = current.filter((b) => b.id !== body.id)
    } else if (body && body.id && body.title) {
      const current = getStoredBannersFromFile()
      const exists = current.some((b) => b.id === body.id)
      if (exists) {
        updated = current.map((b) => (b.id === body.id ? body : b))
      } else {
        updated = [body, ...current]
      }
    } else {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const success = saveBannersToFile(updated)
    if (success) {
      return NextResponse.json({ success: true, count: updated.length, banners: updated })
    } else {
      return NextResponse.json({ error: 'Failed to write banners to storage' }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
