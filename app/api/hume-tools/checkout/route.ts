import { NextRequest, NextResponse } from 'next/server'
import { getCart, formatPrice } from '@/lib/shopify'

// Hume Tool: Initiate checkout
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
        success: false,
        demo_mode: true,
        message: 'Checkout is not available in demo mode. Contact us at hello@aionysus.wine to place an order.',
      })
    }

    if (!cart_id) {
      return NextResponse.json({
        success: false,
        message: 'Your cart is empty. Add some wines first before checking out.',
      })
    }

    const cart = await getCart(cart_id)

    if (!cart || cart.totalQuantity === 0) {
      return NextResponse.json({
        success: false,
        message: 'Your cart is empty. Tell me what wines you would like to order.',
      })
    }

    const totalAmount = formatPrice(
      cart.cost.totalAmount.amount,
      cart.cost.totalAmount.currencyCode
    )

    const itemSummary = cart.lines.edges
      .map((edge) => `${edge.node.quantity}x ${edge.node.merchandise.product.title}`)
      .join(', ')

    return NextResponse.json({
      success: true,
      message: `Perfect! Your order of ${cart.totalQuantity} item${cart.totalQuantity > 1 ? 's' : ''} totaling ${totalAmount} is ready. I'm sending the checkout link to your screen now. Tap the checkout button to complete your purchase.`,
      checkout: {
        url: cart.checkoutUrl,
        total_items: cart.totalQuantity,
        total_amount: totalAmount,
        items: itemSummary,
      },
      action: 'show_checkout_button',
    })

  } catch (error) {
    console.error('[Hume Tool] checkout error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to prepare checkout. Please try again.',
      },
      { status: 500 }
    )
  }
}
