import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { ProductItem } from '@/src/types/product'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json')
const tmpFilePath = path.join(os.tmpdir(), 'alpha_products.json')
const deletedFilePath = path.join(os.tmpdir(), 'alpha_deleted_product_ids.json')

const g = globalThis as unknown as {
  __alpha_products?: ProductItem[]
  __alpha_deleted_ids?: Set<string>
}

function getDeletedProductIdsFromFile(): Set<string> {
  if (g.__alpha_deleted_ids) return g.__alpha_deleted_ids
  g.__alpha_deleted_ids = new Set<string>()
  try {
    if (fs.existsSync(deletedFilePath)) {
      const data = JSON.parse(fs.readFileSync(deletedFilePath, 'utf-8'))
      if (Array.isArray(data)) {
        data.forEach((id: string) => g.__alpha_deleted_ids!.add(id))
      }
    }
  } catch (e) {}
  return g.__alpha_deleted_ids
}

function saveDeletedProductIdToFile(id: string): void {
  const ids = getDeletedProductIdsFromFile()
  ids.add(id)
  try {
    fs.writeFileSync(deletedFilePath, JSON.stringify(Array.from(ids)), 'utf-8')
  } catch (e) {}
}

function getStoredProductsFromFile(): ProductItem[] {
  // 1. Check in-memory global store first (reflects latest live edits/deletions)
  if (g.__alpha_products !== undefined && Array.isArray(g.__alpha_products)) {
    return g.__alpha_products
  }

  // 2. Check /tmp on serverless environments
  try {
    if (fs.existsSync(tmpFilePath)) {
      const content = fs.readFileSync(tmpFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        g.__alpha_products = parsed
        return parsed
      }
    }
  } catch (e) {}

  // 3. Fallback to src/data/products.json
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        g.__alpha_products = parsed
        return parsed
      }
    }
  } catch (err) {
    console.error('[API /api/products] Error reading products file:', err)
  }

  return []
}

function saveProductsToFile(products: ProductItem[]): boolean {
  // Always update in-memory global cache
  g.__alpha_products = products

  let diskWritten = false

  // Try local source tree
  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf-8')
    diskWritten = true
  } catch (err) {
    // Expected on serverless / Vercel read-only filesystem
  }

  // Try /tmp for cloud lambdas
  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify(products, null, 2), 'utf-8')
    diskWritten = true
  } catch (err) {}

  return true // Global in-memory and/or disk is saved
}

export async function GET(req: NextRequest) {
  const products = getStoredProductsFromFile()
  const deletedIds = getDeletedProductIdsFromFile()
  const activeProducts = products.filter((p) => !deletedIds.has(p.id))
  return NextResponse.json(activeProducts, {
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
    let updatedProducts: ProductItem[] = []

    if (Array.isArray(body)) {
      // Entire array save - never auto-delete omitted products!
      const deletedIds = getDeletedProductIdsFromFile()
      updatedProducts = body.filter((p) => !deletedIds.has(p.id))
    } else if (body && body.action === 'delete' && body.id) {
      // Delete single item permanently only when explicitly requested
      saveDeletedProductIdToFile(body.id)
      const current = getStoredProductsFromFile()
      updatedProducts = current.filter((p) => p.id !== body.id)
    } else if (body && body.action === 'restoreProduct' && body.id) {
      const ids = getDeletedProductIdsFromFile()
      ids.delete(body.id)
      try {
        fs.writeFileSync(deletedFilePath, JSON.stringify(Array.from(ids)), 'utf-8')
      } catch (e) {}
      const current = getStoredProductsFromFile()
      updatedProducts = current
    } else if (body && body.action === 'saveSingle' && body.product) {
      // Upsert single item
      const current = getStoredProductsFromFile()
      const exists = current.some((p) => p.id === body.product.id)
      if (exists) {
        updatedProducts = current.map((p) => (p.id === body.product.id ? body.product : p))
      } else {
        updatedProducts = [body.product, ...current]
      }
    } else if (body && body.id && body.title) {
      // Direct product upsert
      const current = getStoredProductsFromFile()
      const exists = current.some((p) => p.id === body.id)
      if (exists) {
        updatedProducts = current.map((p) => (p.id === body.id ? body : p))
      } else {
        updatedProducts = [body, ...current]
      }
    } else {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    saveProductsToFile(updatedProducts)
    return NextResponse.json({ success: true, count: updatedProducts.length, products: updatedProducts })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
