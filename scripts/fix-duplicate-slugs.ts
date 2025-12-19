/**
 * Fix duplicate year slugs (e.g., "1985-1985-veuve-clicquot" → "1985-veuve-clicquot")
 *
 * Run with: npx tsx scripts/fix-duplicate-slugs.ts
 */
import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL not found')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function fixDuplicateSlugs() {
  console.log('🔧 Fixing duplicate year slugs...\n')

  // Find all slugs with duplicate years (e.g., "1985-1985-...")
  const duplicates = await sql`
    SELECT id, name, slug, vintage
    FROM wines
    WHERE slug ~ '^[0-9]{4}-[0-9]{4}-'
  `

  console.log(`Found ${duplicates.length} wines with duplicate year slugs\n`)

  let fixed = 0
  for (const wine of duplicates) {
    // Remove the duplicate year prefix
    // "1985-1985-veuve-clicquot" → "1985-veuve-clicquot"
    const newSlug = wine.slug.replace(/^(\d{4})-\d{4}-/, '$1-')

    if (newSlug !== wine.slug) {
      try {
        await sql`
          UPDATE wines
          SET slug = ${newSlug}
          WHERE id = ${wine.id}
        `
        console.log(`  ✅ ${wine.slug} → ${newSlug}`)
        fixed++
      } catch (e: any) {
        // If slug already exists, add a suffix
        if (e.code === '23505') {
          const uniqueSlug = `${newSlug}-${wine.id}`
          await sql`
            UPDATE wines
            SET slug = ${uniqueSlug}
            WHERE id = ${wine.id}
          `
          console.log(`  ✅ ${wine.slug} → ${uniqueSlug} (with suffix)`)
          fixed++
        } else {
          console.error(`  ❌ Error fixing ${wine.slug}:`, e.message)
        }
      }
    }
  }

  console.log(`\n✨ Fixed ${fixed} slugs`)

  // Show sample of fixed slugs
  const samples = await sql`
    SELECT slug FROM wines
    WHERE slug LIKE '%veuve%' OR slug LIKE '%cristal%' OR slug LIKE '%krug%'
    LIMIT 5
  `
  console.log('\nSample slugs after fix:')
  samples.forEach(s => console.log(`  ${s.slug}`))
}

fixDuplicateSlugs().catch(console.error)
