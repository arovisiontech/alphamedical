import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { ProductItem } from '@/src/types/product'

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'products.json')

function getStoredProductsFromFile(): ProductItem[] {
  try {
    if (fs.existsSync(dataFilePath)) {
      const content = fs.readFileSync(dataFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.error('[API /api/products] Error reading products file:', err)
  }
  return []
}

function saveProductsToFile(products: ProductItem[]): boolean {
  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('[API /api/products] Error writing products file:', err)
    return false
  }
}

export async function GET(req: NextRequest) {
  const products = getStoredProductsFromFile()
  return NextResponse.json(products, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let updatedProducts: ProductItem[] = []

    if (Array.isArray(body)) {
      // Entire array save
      updatedProducts = body
    } else if (body && body.action === 'delete' && body.id) {
      // Delete single item
      const current = getStoredProductsFromFile()
      updatedProducts = current.filter((p) => p.id !== body.id)
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

    const success = saveProductsToFile(updatedProducts)
    if (success) {
      return NextResponse.json({ success: true, count: updatedProducts.length, products: updatedProducts })
    } else {
      return NextResponse.json({ error: 'Failed to write to storage' }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
