import React from 'react'
import ProductsPageClient from '@/src/components/public/ProductsPageClient'
import productsData from '@/src/data/products.json'
import categoriesData from '@/src/data/categories.json'
import { ProductItem } from '@/src/types/product'
import { CategoryItem } from '@/src/types/category'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function ProductsPage() {
  const initialProducts = (productsData as unknown as ProductItem[]).filter(
    (p) => p && p.is_published !== false
  )
  const initialCategories = (categoriesData as unknown as CategoryItem[]).filter(
    (c) => c && c.is_published !== false
  )

  return (
    <ProductsPageClient
      initialProducts={initialProducts}
      initialCategories={initialCategories}
    />
  )
}
