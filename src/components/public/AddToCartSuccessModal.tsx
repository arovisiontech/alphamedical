'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ShoppingBag, ArrowRight, X, ArrowLeft } from 'lucide-react'
import { ProductItem } from '@/src/types/product'
import SafeProductImage from '@/src/components/public/SafeProductImage'
import { getStoredCart, getStoredCartCount } from '@/src/lib/dataStore'

interface AddToCartEventDetail {
  product: ProductItem
  quantity: number
  size?: string
  type?: string
  cart?: any[]
}

export default function AddToCartSuccessModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [addedItem, setAddedItem] = useState<AddToCartEventDetail | null>(null)
  const [cartTotal, setCartTotal] = useState(0)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const handleItemAdded = (e: Event) => {
      const customEvent = e as CustomEvent<AddToCartEventDetail>
      if (customEvent.detail && customEvent.detail.product) {
        setAddedItem(customEvent.detail)
        
        // Calculate latest cart subtotal
        const currentCart =
          customEvent.detail.cart && customEvent.detail.cart.length > 0
            ? customEvent.detail.cart
            : getStoredCart()

        const count = currentCart.reduce(
          (acc: number, it: any) => acc + Math.max(1, Number(it.quantity) || 1),
          0
        )
        const total = currentCart.reduce(
          (acc: number, it: any) =>
            acc + (Number(it.price) || 0) * Math.max(1, Number(it.quantity) || 1),
          0
        )

        const fallbackCount = count > 0 ? count : Math.max(1, Number(customEvent.detail.quantity) || 1)
        const fallbackTotal =
          total > 0
            ? total
            : (Number(customEvent.detail.product.price) || 53.9) * fallbackCount

        setCartTotal(fallbackTotal)
        setCartCount(fallbackCount)
        setIsOpen(true)
      }
    }

    window.addEventListener('alpha_item_added_to_cart', handleItemAdded)
    return () => {
      window.removeEventListener('alpha_item_added_to_cart', handleItemAdded)
    }
  }, [])

  if (!isOpen || !addedItem) return null

  const { product, quantity } = addedItem
  const unitPrice = product.price ?? 53.90
  const itemTotal = unitPrice * quantity

  const handleCheckout = () => {
    setIsOpen(false)
    router.push('/checkout')
  }

  const handleContinueShopping = () => {
    setIsOpen(false)
  }

  const handleOpenFullCart = () => {
    setIsOpen(false)
    router.push('/checkout')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in font-sans">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* TOP STATUS BAR */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wide">
                Added to Cart Successfully!
              </h3>
              <p className="text-[11px] font-medium text-emerald-700">
                Item is reserved in your USA Store order.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleContinueShopping}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRODUCT DETAILS CARD */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {/* Image */}
            <div className="relative w-20 h-20 bg-white rounded-xl border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
              <SafeProductImage
                src={product.featured_image || '/images/products/image-399.png'}
                alt={product.title}
                width={80}
                height={80}
                className="object-contain w-full h-full"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2">
                {product.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-semibold text-[#96161B]">
                  SKU: {product.sku || 'AMS-2026'}
                </span>
                <span>•</span>
                <span className="font-medium text-slate-600">
                  Qty: {quantity}
                </span>
              </div>
              <div className="text-base font-black text-slate-900 pt-0.5">
                ${itemTotal.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-500">
                  (${unitPrice.toFixed(2)} each)
                </span>
              </div>
            </div>
          </div>

          {/* CART SUMMARY BAR */}
          <div className="flex items-center justify-between py-2 border-y border-slate-100 text-xs text-slate-600 font-medium">
            <span>Cart Total ({cartCount} {cartCount === 1 ? 'item' : 'items'}):</span>
            <span className="text-sm font-black text-slate-900">
              ${cartTotal.toFixed(2)}
            </span>
          </div>

          {/* TWO PRIMARY ACTION BUTTONS */}
          <div className="space-y-2.5 pt-1">
            {/* PROCEED TO CHECKOUT BUTTON */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-[#96161B] hover:bg-[#7e1216] active:scale-[0.99] text-white py-3.5 px-6 rounded-2xl font-black text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-red-950/20 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* CONTINUE SHOPPING BUTTON */}
            <button
              type="button"
              onClick={handleContinueShopping}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </button>
          </div>

          {/* QUICK LINK TO FULL CART */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleOpenFullCart}
              className="text-xs font-bold text-[#96161B] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View / Edit Full Cart ({cartCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
