/**
 * Analyze wine type distribution in the database
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

async function analyze() {
  // Check wine_type distribution
  console.log('=== Wine Type Distribution ===')
  const types = await sql`
    SELECT wine_type, COUNT(*) as count
    FROM wines
    WHERE is_active = true
    GROUP BY wine_type
    ORDER BY count DESC
  `
  types.forEach(t => console.log(`  ${t.wine_type || 'NULL'}: ${t.count}`))

  // Check color distribution
  console.log('\n=== Color Distribution ===')
  const colors = await sql`
    SELECT color, COUNT(*) as count
    FROM wines
    WHERE is_active = true
    GROUP BY color
    ORDER BY count DESC
  `
  colors.forEach(c => console.log(`  ${c.color || 'NULL'}: ${c.count}`))

  // Sample wines that might be sparkling (Champagne, Prosecco, etc)
  console.log('\n=== Potential Sparkling Wines (by name) ===')
  const sparkling = await sql`
    SELECT id, name, wine_type, color
    FROM wines
    WHERE is_active = true
    AND (
      LOWER(name) LIKE '%champagne%' OR
      LOWER(name) LIKE '%prosecco%' OR
      LOWER(name) LIKE '%cava%' OR
      LOWER(name) LIKE '%cremant%' OR
      LOWER(name) LIKE '%sparkling%' OR
      LOWER(name) LIKE '%brut%' OR
      LOWER(name) LIKE '%blanc de blanc%' OR
      LOWER(name) LIKE '%dom perignon%' OR
      LOWER(name) LIKE '%krug%' OR
      LOWER(name) LIKE '%bollinger%' OR
      LOWER(name) LIKE '%veuve%' OR
      LOWER(name) LIKE '%moët%' OR
      LOWER(name) LIKE '%moet%' OR
      LOWER(name) LIKE '%taittinger%' OR
      LOWER(name) LIKE '%pol roger%' OR
      LOWER(name) LIKE '%louis roederer%' OR
      LOWER(name) LIKE '%cristal%' OR
      LOWER(name) LIKE '%ruinart%'
    )
  `
  console.log(`  Found ${sparkling.length} potential sparkling wines`)
  sparkling.slice(0, 10).forEach(w => console.log(`    - ${w.name} (type: ${w.wine_type}, color: ${w.color})`))

  // Sample wines that might be rosé
  console.log('\n=== Potential Rosé Wines (by name) ===')
  const rose = await sql`
    SELECT id, name, wine_type, color
    FROM wines
    WHERE is_active = true
    AND (
      LOWER(name) LIKE '%rose%' OR
      LOWER(name) LIKE '%rosé%' OR
      LOWER(name) LIKE '%rosato%' OR
      LOWER(name) LIKE '%pink%'
    )
  `
  console.log(`  Found ${rose.length} potential rosé wines`)
  rose.slice(0, 10).forEach(w => console.log(`    - ${w.name} (type: ${w.wine_type}, color: ${w.color})`))

  // Sample wines that might be dessert/sweet
  console.log('\n=== Potential Dessert Wines (by name) ===')
  const dessert = await sql`
    SELECT id, name, wine_type, color
    FROM wines
    WHERE is_active = true
    AND (
      LOWER(name) LIKE '%sauternes%' OR
      LOWER(name) LIKE '%barsac%' OR
      LOWER(name) LIKE '%tokaj%' OR
      LOWER(name) LIKE '%ice wine%' OR
      LOWER(name) LIKE '%eiswein%' OR
      LOWER(name) LIKE '%late harvest%' OR
      LOWER(name) LIKE '%porto%' OR
      LOWER(name) LIKE '%sherry%' OR
      LOWER(name) LIKE '%madeira%' OR
      LOWER(name) LIKE '%vin santo%' OR
      LOWER(name) LIKE '%passito%' OR
      LOWER(name) LIKE '%trockenbeerenauslese%' OR
      LOWER(name) LIKE '%yquem%' OR
      LOWER(name) LIKE '%suduiraut%' OR
      LOWER(name) LIKE '%climens%' OR
      LOWER(name) LIKE '%rieussec%' OR
      LOWER(name) LIKE '%coutet%' OR
      LOWER(name) LIKE '%doisy%'
    )
  `
  console.log(`  Found ${dessert.length} potential dessert wines`)
  dessert.slice(0, 10).forEach(w => console.log(`    - ${w.name} (type: ${w.wine_type}, color: ${w.color})`))

  // Check white wines
  console.log('\n=== Potential White Wines (by name/region) ===')
  const whites = await sql`
    SELECT id, name, wine_type, color, region
    FROM wines
    WHERE is_active = true
    AND (
      LOWER(name) LIKE '%chardonnay%' OR
      LOWER(name) LIKE '%sauvignon blanc%' OR
      LOWER(name) LIKE '%riesling%' OR
      LOWER(name) LIKE '% blanc %' OR
      LOWER(name) LIKE '%blanc %' OR
      LOWER(name) LIKE '% blanc' OR
      LOWER(name) LIKE '%white%' OR
      LOWER(name) LIKE '%montrachet%' OR
      LOWER(name) LIKE '%meursault%' OR
      LOWER(name) LIKE '%chablis%' OR
      LOWER(name) LIKE '%puligny%' OR
      LOWER(name) LIKE '%chassagne%' OR
      LOWER(name) LIKE '%corton-charlemagne%' OR
      LOWER(name) LIKE '%batard%' OR
      LOWER(name) LIKE '%chevalier%' OR
      LOWER(region) LIKE '%chablis%' OR
      LOWER(region) LIKE '%sancerre%'
    )
    AND wine_type != 'white'
  `
  console.log(`  Found ${whites.length} potential WHITE wines NOT marked as white`)
  whites.slice(0, 10).forEach(w => console.log(`    - ${w.name} (type: ${w.wine_type}, color: ${w.color})`))
}

analyze().catch(console.error)
