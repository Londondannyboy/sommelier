'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import {
  Cart,
  CartLine,
  createCart,
  getCart,
  addToCart as shopifyAddToCart,
  updateCartLine,
  removeCartLine,
  formatPrice,
} from '@/lib/shopify'

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  isShopifyEnabled: boolean
  cartCount: number
  cartTotal: string
  checkoutUrl: string | null
  addToCart: (variantId: string, quantity?: number) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_ID_KEY = 'sommelier-shopify-cart-id'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isShopifyEnabled, setIsShopifyEnabled] = useState(false)

  // Initialize cart on mount
  useEffect(() => {
    async function initCart() {
      // Check if Shopify is configured
      const storeConfigured = !!(
        process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
        process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
      )
      setIsShopifyEnabled(storeConfigured)

      if (!storeConfigured) {
        console.log('[Cart] Shopify not configured, using demo mode')
        setIsLoading(false)
        return
      }

      try {
        // Try to get existing cart from localStorage
        const savedCartId = localStorage.getItem(CART_ID_KEY)

        if (savedCartId) {
          const existingCart = await getCart(savedCartId)
          if (existingCart) {
            setCart(existingCart)
            setIsLoading(false)
            return
          }
        }

        // Create new cart if none exists
        const newCart = await createCart()
        localStorage.setItem(CART_ID_KEY, newCart.id)
        setCart(newCart)
      } catch (error) {
        console.error('[Cart] Error initializing cart:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initCart()
  }, [])

  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!isShopifyEnabled) {
        console.log('[Cart] Demo mode - would add:', variantId, quantity)
        return
      }

      try {
        let cartId = cart?.id

        // Create cart if it doesn't exist
        if (!cartId) {
          const newCart = await createCart()
          localStorage.setItem(CART_ID_KEY, newCart.id)
          cartId = newCart.id
        }

        const updatedCart = await shopifyAddToCart(cartId, variantId, quantity)
        setCart(updatedCart)
      } catch (error) {
        console.error('[Cart] Error adding to cart:', error)
        throw error
      }
    },
    [cart, isShopifyEnabled]
  )

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart || !isShopifyEnabled) return

      try {
        if (quantity <= 0) {
          const updatedCart = await removeCartLine(cart.id, lineId)
          setCart(updatedCart)
        } else {
          const updatedCart = await updateCartLine(cart.id, lineId, quantity)
          setCart(updatedCart)
        }
      } catch (error) {
        console.error('[Cart] Error updating quantity:', error)
        throw error
      }
    },
    [cart, isShopifyEnabled]
  )

  const removeItem = useCallback(
    async (lineId: string) => {
      if (!cart || !isShopifyEnabled) return

      try {
        const updatedCart = await removeCartLine(cart.id, lineId)
        setCart(updatedCart)
      } catch (error) {
        console.error('[Cart] Error removing item:', error)
        throw error
      }
    },
    [cart, isShopifyEnabled]
  )

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY)
    setCart(null)
  }, [])

  const cartCount = cart?.totalQuantity ?? 0
  const cartTotal = cart
    ? formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)
    : '£0.00'
  const checkoutUrl = cart?.checkoutUrl ?? null

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        isShopifyEnabled,
        cartCount,
        cartTotal,
        checkoutUrl,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
