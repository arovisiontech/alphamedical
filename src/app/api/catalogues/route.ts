import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'catalogues.json')

function getStoredCataloguesFromFile(): any[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error('[API /api/catalogues] Error reading catalogues file:', err)
  }
  return []
}

function saveCataloguesToFile(catalogues: any[]): boolean {
  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(catalogues, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('[API /api/catalogues] Error writing catalogues file:', err)
    return false
  }
}

export async function GET(req: NextRequest) {
  const catalogues = getStoredCataloguesFromFile()
  return NextResponse.json(catalogues, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let updatedCatalogues: any[] = []

    if (Array.isArray(body)) {
      updatedCatalogues = body
    } else if (body && body.action === 'delete' && body.id) {
      const current = getStoredCataloguesFromFile()
      updatedCatalogues = current.filter((c) => c.id !== body.id)
    } else if (body && body.action === 'saveSingle' && body.catalogue) {
      const current = getStoredCataloguesFromFile()
      const exists = current.some((c) => c.id === body.catalogue.id)
      if (exists) {
        updatedCatalogues = current.map((c) => (c.id === body.catalogue.id ? body.catalogue : c))
      } else {
        updatedCatalogues = [body.catalogue, ...current]
      }
    } else if (body && body.id && body.title) {
      const current = getStoredCataloguesFromFile()
      const exists = current.some((c) => c.id === body.id)
      if (exists) {
        updatedCatalogues = current.map((c) => (c.id === body.id ? body : c))
      } else {
        updatedCatalogues = [body, ...current]
      }
    } else {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const success = saveCataloguesToFile(updatedCatalogues)
    if (success) {
      return NextResponse.json({ success: true, count: updatedCatalogues.length, catalogues: updatedCatalogues })
    } else {
      return NextResponse.json({ error: 'Failed to write to storage' }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
