import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { CategoryItem } from '@/src/types/category'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'categories.json')
const tmpFilePath = path.join(os.tmpdir(), 'alpha_categories.json')

const g = globalThis as unknown as { __alpha_categories?: CategoryItem[] }

function getStoredCategoriesFromFile(): CategoryItem[] {
  // 1. Check src/data/categories.json first (source of truth)
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        g.__alpha_categories = parsed
        return parsed
      }
    }
  } catch (err) {
    console.error('[API /api/categories] Error reading categories file:', err)
  }

  // 2. Check in-memory store
  if (g.__alpha_categories && Array.isArray(g.__alpha_categories) && g.__alpha_categories.length > 0) {
    return g.__alpha_categories
  }

  // 3. Check /tmp on serverless environments
  try {
    if (fs.existsSync(tmpFilePath)) {
      const content = fs.readFileSync(tmpFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        g.__alpha_categories = parsed
        return parsed
      }
    }
  } catch (e) {}

  return []
}

function saveCategoriesToFile(categories: CategoryItem[]): boolean {
  g.__alpha_categories = categories

  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(categories, null, 2), 'utf-8')
  } catch (err) {}

  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify(categories, null, 2), 'utf-8')
  } catch (err) {}

  return true
}

export async function GET(req: NextRequest) {
  const categories = getStoredCategoriesFromFile()
  return NextResponse.json(categories, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
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

    saveCategoriesToFile(updated)
    return NextResponse.json({ success: true, count: updated.length, categories: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
