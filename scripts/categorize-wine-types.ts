/**
 * Script to properly categorize wine types based on name patterns
 *
 * Run with: npx tsx scripts/categorize-wine-types.ts
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

async function categorizeWines() {
  console.log('🍷 Wine Categorization Script\n')

  let totalUpdated = 0

  // 1. Fix Sauternes/Barsac wines → dessert
  console.log('1️⃣ Categorizing DESSERT wines (Sauternes, Barsac, etc.)...')
  const dessertPatterns = [
    '%sauternes%',
    '%barsac%',
    '%tokaj%',
    '%ice wine%',
    '%eiswein%',
    '%late harvest%',
    '%vin santo%',
    '%passito%',
    '%trockenbeerenauslese%',
    '%beerenauslese%',
    '%yquem%',
    '%suduiraut%',
    '%climens%',
    '%rieussec%',
    '%coutet%',
    '%doisy%',
    '%fargues%',
    '%guiraud%',
    '%lafaurie%',
    '%rabaud%',
    '%rayne%',
    '%sigalas%',
    '%clos haut-peyraguey%',
  ]

  for (const pattern of dessertPatterns) {
    const result = await sql`
      UPDATE wines
      SET wine_type = 'dessert'
      WHERE is_active = true
      AND wine_type != 'dessert'
      AND LOWER(name) LIKE ${pattern}
      RETURNING id, name
    `
    if (result.length > 0) {
      console.log(`   Updated ${result.length} wines matching "${pattern}"`)
      result.forEach(w => console.log(`     - ${w.name}`))
      totalUpdated += result.length
    }
  }

  // 2. Fix Rosé wines (still wines, not sparkling rosé champagne)
  console.log('\n2️⃣ Categorizing ROSÉ wines...')
  const roseResult = await sql`
    UPDATE wines
    SET wine_type = 'rose', color = 'Rose'
    WHERE is_active = true
    AND wine_type NOT IN ('rose', 'Rosé', 'sparkling', 'Sparkling')
    AND (
      LOWER(name) LIKE '%rosé%' OR
      LOWER(name) LIKE '%rosato%' OR
      (LOWER(name) LIKE '% rose %' AND LOWER(name) NOT LIKE '%champagne%') OR
      (LOWER(name) LIKE '% rose' AND LOWER(name) NOT LIKE '%champagne%')
    )
    RETURNING id, name
  `
  if (roseResult.length > 0) {
    console.log(`   Updated ${roseResult.length} rosé wines`)
    roseResult.forEach(w => console.log(`     - ${w.name}`))
    totalUpdated += roseResult.length
  }

  // 3. Fix White Burgundy wines (Montrachet, Meursault, Puligny, Chassagne, Chablis, Corton-Charlemagne)
  console.log('\n3️⃣ Categorizing WHITE Burgundy wines...')
  const whiteBurgundyPatterns = [
    '%montrachet%',
    '%meursault%',
    '%puligny%',
    '%chassagne%',
    '%chablis%',
    '%corton-charlemagne%',
    '%batard%',
    '%bienvenues%',
    '%criots%',
  ]

  for (const pattern of whiteBurgundyPatterns) {
    const result = await sql`
      UPDATE wines
      SET wine_type = 'white', color = 'White'
      WHERE is_active = true
      AND wine_type NOT IN ('white', 'White', 'sparkling', 'Sparkling')
      AND LOWER(name) LIKE ${pattern}
      AND LOWER(name) NOT LIKE '%rouge%'
      RETURNING id, name
    `
    if (result.length > 0) {
      console.log(`   Updated ${result.length} white wines matching "${pattern}"`)
      totalUpdated += result.length
    }
  }

  // 4. Fix other white wines by grape/region
  console.log('\n4️⃣ Categorizing other WHITE wines...')
  const whitePatterns = [
    '%sauvignon blanc%',
    '%chardonnay%',
    '%riesling%',
    '%gewurztraminer%',
    '%viognier%',
    '%chenin blanc%',
    '%sancerre%',
    '%pouilly-fume%',
    '%pouilly fume%',
    '%muscadet%',
    '%vouvray%',
    '%condrieu%',
    '%hermitage blanc%',
  ]

  for (const pattern of whitePatterns) {
    const result = await sql`
      UPDATE wines
      SET wine_type = 'white', color = 'White'
      WHERE is_active = true
      AND wine_type NOT IN ('white', 'White', 'sparkling', 'Sparkling', 'dessert')
      AND LOWER(name) LIKE ${pattern}
      RETURNING id, name
    `
    if (result.length > 0) {
      console.log(`   Updated ${result.length} white wines matching "${pattern}"`)
      totalUpdated += result.length
    }
  }

  // 5. Update color field for wines already typed correctly
  console.log('\n5️⃣ Updating COLOR field for existing wines...')

  // Set color = 'Red' for red wines
  const redColorResult = await sql`
    UPDATE wines
    SET color = 'Red'
    WHERE is_active = true
    AND wine_type = 'red'
    AND (color IS NULL OR color = '')
    RETURNING id
  `
  console.log(`   Set color='Red' for ${redColorResult.length} red wines`)

  // Set color = 'White' for white wines
  const whiteColorResult = await sql`
    UPDATE wines
    SET color = 'White'
    WHERE is_active = true
    AND wine_type = 'white'
    AND (color IS NULL OR color = '')
    RETURNING id
  `
  console.log(`   Set color='White' for ${whiteColorResult.length} white wines`)

  // Set color = 'Rose' for rosé wines
  const roseColorResult = await sql`
    UPDATE wines
    SET color = 'Rose'
    WHERE is_active = true
    AND wine_type IN ('rose', 'Rosé')
    AND (color IS NULL OR color = '')
    RETURNING id
  `
  console.log(`   Set color='Rose' for ${roseColorResult.length} rosé wines`)

  // Set color = 'Gold' for dessert wines
  const dessertColorResult = await sql`
    UPDATE wines
    SET color = 'Gold'
    WHERE is_active = true
    AND wine_type = 'dessert'
    AND (color IS NULL OR color = '')
    RETURNING id
  `
  console.log(`   Set color='Gold' for ${dessertColorResult.length} dessert wines`)

  // 6. Normalize wine_type to lowercase
  console.log('\n6️⃣ Normalizing wine_type to lowercase...')
  const normalizeResult = await sql`
    UPDATE wines
    SET wine_type = LOWER(wine_type)
    WHERE wine_type != LOWER(wine_type)
    RETURNING id
  `
  console.log(`   Normalized ${normalizeResult.length} wine types`)

  // Final summary
  console.log('\n📊 Final Wine Type Distribution:')
  const finalTypes = await sql`
    SELECT wine_type, COUNT(*) as count
    FROM wines
    WHERE is_active = true
    GROUP BY wine_type
    ORDER BY count DESC
  `
  finalTypes.forEach(t => console.log(`   ${t.wine_type}: ${t.count}`))

  console.log('\n📊 Final Color Distribution:')
  const finalColors = await sql`
    SELECT color, COUNT(*) as count
    FROM wines
    WHERE is_active = true
    GROUP BY color
    ORDER BY count DESC
  `
  finalColors.forEach(c => console.log(`   ${c.color || 'NULL'}: ${c.count}`))

  console.log(`\n✨ Done! Total wines re-categorized: ${totalUpdated}`)
}

categorizeWines().catch(console.error)
