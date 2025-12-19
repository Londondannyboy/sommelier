/**
 * Script to generate SEO-friendly slugs for wines
 *
 * Run with: npx tsx scripts/generate-wine-slugs.ts
 *
 * This will:
 * 1. Add a 'slug' column to the wines table if it doesn't exist
 * 2. Generate slugs from wine name + vintage (e.g., "1952-chateau-haut-brion")
 * 3. Update all wines with their SEO-friendly slugs
 */

import { neon } from '@neondatabase/serverless'

// Load environment variables
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

/**
 * Convert wine name + vintage to SEO-friendly slug
 * Examples:
 *   "Château Haut-Brion" + 1952 → "1952-chateau-haut-brion"
 *   "Château Margaux" + 2010 → "2010-chateau-margaux"
 *   "Dom Pérignon Rosé" + 2008 → "2008-dom-perignon-rose"
 */
function generateSlug(name: string, vintage?: number | null): string {
  // Start with vintage if available
  let slug = vintage ? `${vintage}-` : ''

  // Clean the wine name
  slug += name
    .toLowerCase()
    // Remove accents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace special characters
    .replace(/['']/g, '')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    // Replace spaces and special chars with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Remove duplicate hyphens
    .replace(/-+/g, '-')

  return slug
}

async function main() {
  console.log('🍷 Wine Slug Generator\n')

  try {
    // Step 1: Check if slug column exists, add if not
    console.log('📋 Checking database schema...')

    const columnCheck = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'wines' AND column_name = 'slug'
    `

    if (columnCheck.length === 0) {
      console.log('➕ Adding slug column to wines table...')
      await sql`
        ALTER TABLE wines
        ADD COLUMN slug VARCHAR(255) UNIQUE
      `
      console.log('✅ Slug column added')
    } else {
      console.log('✅ Slug column already exists')
    }

    // Step 2: Fetch all wines
    console.log('\n📦 Fetching wines...')
    const wines = await sql`
      SELECT id, name, vintage, slug
      FROM wines
      ORDER BY id ASC
    `
    console.log(`   Found ${wines.length} wines`)

    // Step 3: Generate and update slugs
    console.log('\n🔄 Generating slugs...\n')

    let updated = 0
    let skipped = 0
    const slugMap = new Map<string, number>() // Track used slugs

    for (const wine of wines) {
      let slug = generateSlug(wine.name, wine.vintage)

      // Handle duplicates by adding a suffix
      if (slugMap.has(slug)) {
        const count = slugMap.get(slug)! + 1
        slugMap.set(slug, count)
        slug = `${slug}-${count}`
      } else {
        slugMap.set(slug, 1)
      }

      // Update if slug is different or empty
      if (wine.slug !== slug) {
        await sql`
          UPDATE wines
          SET slug = ${slug}
          WHERE id = ${wine.id}
        `
        console.log(`   ✅ ${wine.id}: ${wine.name} → ${slug}`)
        updated++
      } else {
        skipped++
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Skipped: ${skipped} (already had correct slug)`)
    console.log(`   Total:   ${wines.length}`)

    // Step 4: Create index on slug for fast lookups
    console.log('\n📇 Creating index on slug column...')
    try {
      await sql`
        CREATE INDEX IF NOT EXISTS idx_wines_slug ON wines(slug)
      `
      console.log('✅ Index created')
    } catch (e) {
      console.log('ℹ️  Index may already exist')
    }

    // Show sample slugs
    console.log('\n🎯 Sample SEO-friendly URLs:')
    const samples = await sql`
      SELECT id, name, vintage, slug
      FROM wines
      WHERE slug IS NOT NULL
      ORDER BY RANDOM()
      LIMIT 5
    `
    for (const wine of samples) {
      console.log(`   /wines/${wine.slug}`)
    }

    console.log('\n✨ Done! Wines now have SEO-friendly slugs.')
    console.log('   Next: Update your routes to use slugs instead of IDs.\n')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

main()
