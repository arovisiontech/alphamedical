import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'catalogues.json')
const tmpFilePath = path.join(os.tmpdir(), 'alpha_catalogues.json')

const g = globalThis as unknown as { __alpha_catalogues?: any[] }

function getStoredCataloguesFromFile(): any[] {
  if (g.__alpha_catalogues && Array.isArray(g.__alpha_catalogues) && g.__alpha_catalogues.length > 0) {
    return g.__alpha_catalogues
  }

  try {
    if (fs.existsSync(tmpFilePath)) {
      const content = fs.readFileSync(tmpFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        g.__alpha_catalogues = parsed
        return parsed
      }
    }
  } catch (e) {}

  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        g.__alpha_catalogues = parsed
        return parsed
      }
    }
  } catch (err) {
    console.error('[API /api/catalogues] Error reading catalogues file:', err)
  }
  return []
}

function saveCataloguesToFile(catalogues: any[]): boolean {
  g.__alpha_catalogues = catalogues

  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(catalogues, null, 2), 'utf-8')
  } catch (err) {}

  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify(catalogues, null, 2), 'utf-8')
  } catch (err) {}

  return true
}

export async function GET(req: NextRequest) {
  const catalogues = getStoredCataloguesFromFile()
  return NextResponse.json(catalogues, {
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

    saveCataloguesToFile(updatedCatalogues)
    return NextResponse.json({ success: true, count: updatedCatalogues.length, catalogues: updatedCatalogues })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
