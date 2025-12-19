import { NextResponse } from 'next/server'
import { stackServerApp } from '@/stack/server'
import { getOrdersByEmail, ShopifyOrder } from '@/lib/shopify-admin'

// Simple in-memory cache (5 minute TTL)
const cache = new Map<string, { data: ShopifyOrder[]; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = user.primaryEmail
    if (!email) {
      return NextResponse.json({ orders: [] })
    }

    // Check cache
    const cacheKey = `orders:${email}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ orders: cached.data, fromCache: true })
    }

    // Fetch from Shopify
    const orders = await getOrdersByEmail(email)

    // Update cache
    cache.set(cacheKey, { data: orders, timestamp: Date.now() })

    // Transform orders for frontend
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.name,
      createdAt: order.createdAt,
      total: {
        amount: order.totalPriceSet.shopMoney.amount,
        currency: order.totalPriceSet.shopMoney.currencyCode,
      },
      fulfillmentStatus: order.displayFulfillmentStatus,
      financialStatus: order.displayFinancialStatus,
      items: order.lineItems.edges.map((edge) => ({
        title: edge.node.title,
        quantity: edge.node.quantity,
        price: edge.node.originalTotalSet.shopMoney.amount,
      })),
    }))

    return NextResponse.json({ orders: formattedOrders })
  } catch (error) {
    console.error('[Orders API] Error:', error)

    // Return empty orders on error (don't break the dashboard)
    return NextResponse.json({
      orders: [],
      error: 'Failed to fetch orders. Please try again later.'
    })
  }
}
