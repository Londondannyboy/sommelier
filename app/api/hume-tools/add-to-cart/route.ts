import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { searchProducts, createCart, addToCart, getCart } from '@/lib/shopify'

const sql = neon(process.env.DATABASE_URL!)

// Hume Tool: Add wine to Shopify cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wine_name, wine_id, quantity = 1, cart_id } = body

    // Validate input
    if (!wine_name && !wine_id) {
      return NextResponse.json({
        success: false,
        error: 'Either wine_name or wine_id is required',
      })
    }

    // Check if Shopify is configured
    const shopifyConfigured = !!(
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN &&
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
    )

    if (!shopifyConfigured) {
      // Demo mode - return success but note it's not connected
      return NextResponse.json({
        success: true,
        demo_mode: true,
        message: `Would add ${quantity} bottle(s) of "${wine_name || `wine ID ${wine_id}`}" to cart. Shopify checkout is not yet configured.`,
        action_needed: 'Configure Shopify store credentials to enable real checkout.',
      })
    }

    // Find the wine in our database
    let wine: any

    if (wine_id) {
      const wines = await sql`
        SELECT id, name, winery, price_retail, image_url
        FROM wines
        WHERE id = ${wine_id} AND is_active = true
      `
      wine = wines[0]
    } else if (wine_name) {
      // Search by name (fuzzy match)
      const wines = await sql`
        SELECT id, name, winery, price_retail, image_url
        FROM wines
        WHERE is_active = true
        AND (
          LOWER(name) LIKE LOWER(${'%' + wine_name + '%'})
          OR LOWER(winery) LIKE LOWER(${'%' + wine_name + '%'})
        )
        LIMIT 1
      `
      wine = wines[0]
    }

    if (!wine) {
      return NextResponse.json({
        success: false,
        error: `Could not find wine "${wine_name || wine_id}" in our database`,
      })
    }

    // Search for this wine in Shopify
    const searchQuery = `${wine.name} ${wine.winery}`.trim()
    const shopifyProducts = await searchProducts(searchQuery, 5)

    if (shopifyProducts.length === 0) {
      return NextResponse.json({
        success: false,
        error: `Wine "${wine.name}" is not yet available in our shop. Please contact us to order.`,
        wine_found: {
          id: wine.id,
          name: wine.name,
          winery: wine.winery,
          price: wine.price_retail,
        },
      })
    }

    // Find best match (exact title match preferred)
    const product = shopifyProducts.find(
      (p) => p.title.toLowerCase() === wine.name.toLowerCase()
    ) || shopifyProducts[0]

    const variant = product.variants.edges[0]?.node
    if (!variant || !variant.availableForSale) {
      return NextResponse.json({
        success: false,
        error: `Wine "${wine.name}" is currently out of stock`,
      })
    }

    // Get or create cart
    let currentCartId = cart_id

    if (currentCartId) {
      // Verify cart exists
      const existingCart = await getCart(currentCartId)
      if (!existingCart) {
        currentCartId = null
      }
    }

    if (!currentCartId) {
      const newCart = await createCart()
      currentCartId = newCart.id
    }

    // Add to cart
    const updatedCart = await addToCart(currentCartId, variant.id, quantity)

    const totalItems = updatedCart.totalQuantity
    const totalAmount = parseFloat(updatedCart.cost.totalAmount.amount).toFixed(2)
    const currency = updatedCart.cost.totalAmount.currencyCode

    return NextResponse.json({
      success: true,
      message: `Added ${quantity} bottle(s) of ${wine.name} to your cart.`,
      cart: {
        id: updatedCart.id,
        checkout_url: updatedCart.checkoutUrl,
        total_items: totalItems,
        total_amount: `${currency} ${totalAmount}`,
      },
      added_item: {
        wine_name: wine.name,
        winery: wine.winery,
        quantity,
        price: variant.price.amount,
        shopify_product_id: product.id,
        shopify_variant_id: variant.id,
      },
      next_steps: totalItems >= 1
        ? `Your cart has ${totalItems} items totaling ${currency} ${totalAmount}. Say "checkout" when you're ready to complete your purchase.`
        : undefined,
    })

  } catch (error) {
    console.error('[Hume Tool] add-to-cart error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add wine to cart. Please try again.',
      },
      { status: 500 }
    )
  }
}
