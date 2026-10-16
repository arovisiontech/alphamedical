import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { CategoryItem } from '@/src/types/category'

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'categories.json')

function getStoredCategoriesFromFile(): CategoryItem[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error('[API /api/categories] Error reading categories file:', err)
  }
  return []
}

function saveCategoriesToFile(categories: CategoryItem[]): boolean {
  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(categories, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('[API /api/categories] Error writing categories file:', err)
    return false
  }
}

export async function GET(req: NextRequest) {
  const categories = getStoredCategoriesFromFile()
  return NextResponse.json(categories, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let updated: CategoryItem[] = []

    if (Array.isArray(body)) {
      updated = body
    } else if (body && body.action === 'delete' && body.id) {
      const current = getStoredCategoriesFromFile()
      updated = current.filter((c) => c.id !== body.id)
    } else if (body && body.id && body.name) {
      const current = getStoredCategoriesFromFile()
      const exists = current.some((c) => c.id === body.id)
      if (exists) {
        updated = current.map((c) => (c.id === body.id ? body : c))
      } else {
        updated = [body, ...current]
      }
    } else {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const success = saveCategoriesToFile(updated)
    if (success) {
      return NextResponse.json({ success: true, count: updated.length, categories: updated })
    } else {
      return NextResponse.json({ error: 'Failed to write categories to storage' }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
