import { NextRequest, NextResponse } from 'next/server'
import { getCart, formatPrice } from '@/lib/shopify'

// Hume Tool: Get current cart contents
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cart_id } = body

    // Check if Shopify is configured
    const shopifyConfigured = !!(
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
    )

    if (!shopifyConfigured) {
      return NextResponse.json({
        success: true,
        demo_mode: true,
        message: 'Shopping cart is in demo mode. Configure Shopify to enable real checkout.',
        cart: { items: [], total_items: 0, total_amount: '£0.00' },
      })
    }

    if (!cart_id) {
      return NextResponse.json({
        success: true,
        message: 'Your cart is empty. Tell me what wines you would like to add.',
        cart: { items: [], total_items: 0, total_amount: '£0.00' },
      })
    }

    const cart = await getCart(cart_id)

    if (!cart) {
      return NextResponse.json({
        success: true,
        message: 'Your cart is empty. What wines would you like to explore?',
        cart: { items: [], total_items: 0, total_amount: '£0.00' },
      })
    }

    const items = cart.lines.edges.map((edge) => ({
      name: edge.node.merchandise.product.title,
      quantity: edge.node.quantity,
      price: formatPrice(edge.node.merchandise.price.amount, edge.node.merchandise.price.currencyCode),
      line_id: edge.node.id,
    }))

    const totalAmount = formatPrice(
      cart.cost.totalAmount.amount,
      cart.cost.totalAmount.currencyCode
    )

    const itemSummary = items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(', ')

    return NextResponse.json({
      success: true,
      message: cart.totalQuantity > 0
        ? `Your cart contains ${cart.totalQuantity} item${cart.totalQuantity > 1 ? 's' : ''}: ${itemSummary}. Total: ${totalAmount}.`
        : 'Your cart is empty.',
      cart: {
        id: cart.id,
        checkout_url: cart.checkoutUrl,
        total_items: cart.totalQuantity,
        total_amount: totalAmount,
        items,
      },
    })

  } catch (error) {
    console.error('[Hume Tool] get-cart error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get cart contents',
      },
      { status: 500 }
    )
  }
}
