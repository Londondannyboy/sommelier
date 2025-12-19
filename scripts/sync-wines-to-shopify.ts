/**
 * Sync wines from Neon database to Shopify
 * Updated for Shopify 2024-01 API (product and variant creation are separate)
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL
const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN

if (!DATABASE_URL || !SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_TOKEN) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

interface Wine {
  id: number
  name: string
  winery: string
  region: string
  country: string
  grape_variety: string
  vintage: number
  wine_type: string
  style: string
  color: string
  price_retail: number
  bottle_size: string
  tasting_notes: string
  critic_scores: string
  drinking_window: string
  image_url: string
  stock_quantity: number
  classification: string
}

async function shopifyAdminFetch(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    }
  )

  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'Shopify API error')
  }

  return json.data
}

async function createProduct(wine: Wine) {
  const description = [
    wine.tasting_notes,
    wine.drinking_window ? `Drinking window: ${wine.drinking_window}` : null,
    wine.classification ? `Classification: ${wine.classification}` : null,
  ].filter(Boolean).join('\n\n')

  const tags = [
    wine.wine_type,
    wine.color,
    wine.style,
    wine.country,
    wine.region,
    wine.grape_variety,
    wine.classification,
    wine.vintage ? `${wine.vintage}` : null,
    wine.winery,
  ].filter(Boolean)

  // Step 1: Create the product (without variants)
  const createMutation = `
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `

  const createInput = {
    title: wine.name,
    vendor: wine.winery || undefined,
    productType: 'Wine',
    tags: tags,
    descriptionHtml: description.replace(/\n/g, '<br>'),
  }

  try {
    const createResult = await shopifyAdminFetch(createMutation, { input: createInput })

    if (createResult.productCreate.userErrors?.length > 0) {
      console.error(`  ❌ Error:`, createResult.productCreate.userErrors[0].message)
      return null
    }

    const product = createResult.productCreate.product
    const variantId = product.variants.edges[0]?.node?.id

    // Step 2: Update the default variant with price using bulk update
    if (variantId && wine.price_retail) {
      const variantMutation = `
        mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            productVariants {
              id
              price
            }
            userErrors {
              field
              message
            }
          }
        }
      `

      await shopifyAdminFetch(variantMutation, {
        productId: product.id,
        variants: [{
          id: variantId,
          price: wine.price_retail.toString(),
          sku: `WINE-${wine.id}`,
        }]
      })
    }

    // Step 3: Add image if available
    if (wine.image_url) {
      await addProductImage(product.id, wine.image_url)
    }

    return product
  } catch (error: any) {
    console.error(`  ❌ Failed:`, error.message)
    return null
  }
}

async function addProductImage(productId: string, imageUrl: string) {
  const mutation = `
    mutation CreateProductMedia($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media {
          ... on MediaImage {
            id
          }
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `

  try {
    await shopifyAdminFetch(mutation, {
      productId,
      media: [{ originalSource: imageUrl, mediaContentType: 'IMAGE' }]
    })
  } catch (error) {
    // Silent fail for images
  }
}

async function getExistingProducts(): Promise<Set<string>> {
  const query = `
    query {
      products(first: 250) {
        edges {
          node {
            title
          }
        }
      }
    }
  `

  const result = await shopifyAdminFetch(query)
  const titles = new Set<string>()

  for (const edge of result.products.edges) {
    titles.add(edge.node.title.toLowerCase())
  }

  return titles
}

async function main() {
  console.log('🍷 Syncing wines from Neon to Shopify...\n')

  console.log('📖 Fetching wines from database...')
  const wines = await sql`
    SELECT id, name, winery, region, country, grape_variety, vintage,
           wine_type, style, color, price_retail, bottle_size,
           tasting_notes, critic_scores, drinking_window, image_url,
           stock_quantity, classification
    FROM wines WHERE is_active = true ORDER BY name
  ` as Wine[]

  console.log(`   Found ${wines.length} wines\n`)

  console.log('🔍 Checking existing Shopify products...')
  const existingProducts = await getExistingProducts()
  console.log(`   Found ${existingProducts.size} existing products\n`)

  let created = 0, skipped = 0, failed = 0

  for (const wine of wines) {
    if (existingProducts.has(wine.name.toLowerCase())) {
      console.log(`⏭️  Skip: "${wine.name}"`)
      skipped++
      continue
    }

    process.stdout.write(`📦 ${wine.name.substring(0, 50)}... `)
    const product = await createProduct(wine)

    if (product) {
      console.log('✅')
      created++
    } else {
      failed++
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Created: ${created}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Failed: ${failed}`)
}

main().catch(console.error)
