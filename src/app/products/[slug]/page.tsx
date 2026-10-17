import fs from 'fs'
import path from 'path'
import os from 'os'
import { Metadata } from 'next'
import ProductDetailClient from '@/src/components/public/ProductDetailClient'
import { ProductItem } from '@/src/types/product'
import initialProductsData from '@/src/data/products.json'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const g = globalThis as unknown as { __alpha_products?: ProductItem[] }

function loadProductsFromDisk(): ProductItem[] {
  // 1. Check in-memory store
  if (g.__alpha_products && Array.isArray(g.__alpha_products) && g.__alpha_products.length > 0) {
    return g.__alpha_products
  }

  // 2. Check os.tmpdir() for cloud lambdas
  try {
    const tmpFilePath = path.join(os.tmpdir(), 'alpha_products.json')
    if (fs.existsSync(tmpFilePath)) {
      const content = fs.readFileSync(tmpFilePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        g.__alpha_products = parsed
        return parsed
      }
    }
  } catch (e) {}

  // 3. Check src/data/products.json
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'products.json')
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        g.__alpha_products = parsed
        return parsed
      }
    }
  } catch (err) {
    console.error('[ProductDetailPage Server] Error reading products from disk:', err)
  }
  return initialProductsData as unknown as ProductItem[]
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim()
  const products = loadProductsFromDisk()
  const product =
    products.find(
      (p) =>
        p.slug.toLowerCase() === decodedSlug ||
        p.id.toLowerCase() === decodedSlug ||
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === decodedSlug
    ) || null

  if (!product) {
    const titleFormatted = decodedSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
    return {
      title: `${titleFormatted} - ALPHA Medical Supplies Store`,
      description: 'Precision surgical instruments and certified medical equipment.',
    }
  }

  return {
    title: `${product.title} - ALPHA Medical Supplies Store`,
    description:
      product.short_description ||
      `Buy ${product.title} - High precision surgical-grade instrument with ISO 13485 & CE certification.`,
    openGraph: {
      title: `${product.title} | ALPHA Medical Supplies`,
      description: product.short_description ?? undefined,
      images: [
        {
          url: product.featured_image || '/images/products/image-399.png',
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim()
  const products = loadProductsFromDisk()

  const product =
    products.find(
      (p) =>
        p.slug.toLowerCase() === decodedSlug ||
        p.id.toLowerCase() === decodedSlug ||
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === decodedSlug
    ) || null

  return <ProductDetailClient initialProduct={product} allProducts={products} targetSlug={decodedSlug} />
}
