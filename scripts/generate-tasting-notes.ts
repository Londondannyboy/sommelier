/**
 * Generate unique, original tasting notes for wines
 *
 * Run with: npx tsx scripts/generate-tasting-notes.ts
 *
 * Uses template-based generation with wine-specific vocabulary
 * to create unique, SEO-friendly tasting notes.
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

// Wine vocabulary by type and region for generating unique descriptions
const vocabulary = {
  red: {
    aromas: [
      'blackcurrant', 'cherry', 'plum', 'blackberry', 'raspberry',
      'cedar', 'tobacco', 'leather', 'earth', 'truffle',
      'vanilla', 'spice', 'coffee', 'chocolate', 'graphite',
      'violet', 'rose petal', 'black pepper', 'clove', 'licorice'
    ],
    flavors: [
      'rich dark fruit', 'silky tannins', 'velvety texture', 'full body',
      'elegant structure', 'long finish', 'mineral undertones', 'complexity',
      'harmonious balance', 'concentrated fruit', 'refined elegance', 'depth'
    ],
    descriptions: [
      'displays remarkable depth and concentration',
      'offers exceptional elegance and poise',
      'showcases the finest qualities of the vintage',
      'presents a complex aromatic profile',
      'delivers outstanding intensity and finesse',
      'exhibits classic characteristics with modern refinement'
    ]
  },
  white: {
    aromas: [
      'citrus', 'lemon', 'lime', 'grapefruit', 'green apple',
      'pear', 'peach', 'apricot', 'tropical fruit', 'melon',
      'white flowers', 'honeysuckle', 'acacia', 'almond', 'hazelnut',
      'butter', 'brioche', 'mineral', 'flint', 'chalk'
    ],
    flavors: [
      'crisp acidity', 'refreshing palate', 'elegant structure', 'creamy texture',
      'bright minerality', 'refined finish', 'subtle complexity', 'balanced fruit',
      'sophisticated expression', 'persistent length', 'pristine clarity'
    ],
    descriptions: [
      'displays brilliant clarity and precision',
      'offers refreshing vibrancy with depth',
      'showcases terroir-driven character',
      'presents crystalline purity',
      'delivers exceptional freshness and finesse',
      'exhibits refined elegance throughout'
    ]
  },
  sparkling: {
    aromas: [
      'brioche', 'toast', 'almond', 'hazelnut', 'citrus',
      'white peach', 'apple', 'pear', 'honeycomb', 'ginger',
      'chalk', 'mineral', 'white flowers', 'yeast', 'cream'
    ],
    flavors: [
      'fine persistent bubbles', 'creamy mousse', 'elegant effervescence',
      'vibrant acidity', 'silky texture', 'toasty complexity',
      'refined length', 'celebratory character', 'sophisticated depth'
    ],
    descriptions: [
      'displays exceptional finesse and elegance',
      'offers a spectacular stream of fine bubbles',
      'showcases exemplary craftsmanship',
      'presents distinguished complexity',
      'delivers remarkable depth and persistence',
      'exhibits the hallmarks of exceptional winemaking'
    ]
  },
  rose: {
    aromas: [
      'strawberry', 'raspberry', 'watermelon', 'citrus', 'peach',
      'rose petal', 'orange blossom', 'herbs', 'mineral', 'spice'
    ],
    flavors: [
      'refreshing palate', 'delicate fruit', 'crisp acidity',
      'elegant structure', 'subtle complexity', 'lingering finish'
    ],
    descriptions: [
      'displays charming freshness and vitality',
      'offers delightful balance and poise',
      'showcases the essence of summer',
      'presents beautiful pink hues with finesse',
      'delivers refreshing character with depth'
    ]
  },
  dessert: {
    aromas: [
      'apricot', 'honey', 'marmalade', 'candied citrus', 'tropical fruit',
      'vanilla', 'caramel', 'butterscotch', 'saffron', 'ginger',
      'botrytis', 'orange peel', 'dried fruit', 'fig', 'date'
    ],
    flavors: [
      'luscious sweetness', 'balanced acidity', 'honeyed richness',
      'silky texture', 'concentrated fruit', 'exceptional length',
      'complex layers', 'opulent character', 'refined elegance'
    ],
    descriptions: [
      'displays remarkable concentration and purity',
      'offers sumptuous sweetness with finesse',
      'showcases noble rot character beautifully',
      'presents luxurious depth and complexity',
      'delivers an unforgettable experience'
    ]
  }
}

// Region-specific characteristics
const regionCharacteristics: Record<string, string[]> = {
  'bordeaux': ['classic structure', 'aging potential', 'distinguished terroir', 'traditional elegance'],
  'pauillac': ['powerful tannins', 'blackcurrant intensity', 'cedar notes', 'exceptional longevity'],
  'margaux': ['feminine elegance', 'floral aromatics', 'silky texture', 'refined sophistication'],
  'st julien': ['harmonious balance', 'classic proportions', 'aristocratic character', 'polished tannins'],
  'st emilion': ['rich fruit', 'Merlot opulence', 'limestone minerality', 'generous warmth'],
  'pomerol': ['velvet texture', 'truffle complexity', 'Merlot purity', 'exotic richness'],
  'pessac': ['smoky mineral', 'tobacco undertones', 'gravelly elegance', 'distinctive character'],
  'burgundy': ['terroir expression', 'Pinot finesse', 'ethereal complexity', 'silky elegance'],
  'champagne': ['fine bubbles', 'toasty complexity', 'chalky minerality', 'celebratory character'],
  'rhone': ['wild herbs', 'garrigue aromatics', 'southern warmth', 'powerful structure'],
  'sauternes': ['honeyed botrytis', 'apricot richness', 'balanced sweetness', 'exceptional aging'],
  'napa': ['bold fruit', 'ripe expression', 'polished tannins', 'generous character'],
  'tuscany': ['Sangiovese character', 'cherry brightness', 'earthy complexity', 'Italian elegance']
}

// Generate random subset of array
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// Generate a unique tasting note for a wine
function generateTastingNote(wine: {
  name: string
  wine_type: string
  region: string
  grape_variety: string
  vintage: number | null
  winery: string
}): string {
  const type = wine.wine_type?.toLowerCase() || 'red'
  const vocab = vocabulary[type as keyof typeof vocabulary] || vocabulary.red

  // Pick random aromas and flavors
  const aromas = pickRandom(vocab.aromas, 3 + Math.floor(Math.random() * 2))
  const flavors = pickRandom(vocab.flavors, 2 + Math.floor(Math.random() * 2))
  const description = vocab.descriptions[Math.floor(Math.random() * vocab.descriptions.length)]

  // Find region-specific characteristics
  const regionLower = (wine.region || '').toLowerCase()
  let regionChar: string[] = []
  for (const [key, chars] of Object.entries(regionCharacteristics)) {
    if (regionLower.includes(key)) {
      regionChar = pickRandom(chars, 1 + Math.floor(Math.random() * 2))
      break
    }
  }

  // Build the tasting note
  const parts: string[] = []

  // Opening sentence with aromas
  const aromaStr = aromas.slice(0, -1).join(', ') + ' and ' + aromas[aromas.length - 1]
  parts.push(`Aromas of ${aromaStr} emerge from the glass.`)

  // Main description
  parts.push(`This wine ${description}.`)

  // Flavor profile
  const flavorStr = flavors.join(', ')
  parts.push(`The palate reveals ${flavorStr}.`)

  // Region-specific note if available
  if (regionChar.length > 0) {
    parts.push(`Showing ${regionChar.join(' and ')} typical of ${wine.region}.`)
  }

  // Vintage/aging note for older wines
  if (wine.vintage && new Date().getFullYear() - wine.vintage > 15) {
    const age = new Date().getFullYear() - wine.vintage
    parts.push(`After ${age} years, this wine continues to evolve beautifully.`)
  }

  return parts.join(' ')
}

async function main() {
  console.log('🍷 Generating Original Tasting Notes\n')

  // Get wines without tasting notes or with short/generic ones
  const wines = await sql`
    SELECT id, name, wine_type, region, grape_variety, vintage, winery
    FROM wines
    WHERE is_active = true
    AND (tasting_notes IS NULL OR tasting_notes = '' OR LENGTH(tasting_notes) < 50)
    ORDER BY RANDOM()
  `

  console.log(`Found ${wines.length} wines needing tasting notes\n`)

  let updated = 0
  const batchSize = 100 // Process in batches

  for (let i = 0; i < wines.length; i++) {
    const wine = wines[i]
    const note = generateTastingNote(wine as any)

    try {
      await sql`
        UPDATE wines
        SET tasting_notes = ${note}
        WHERE id = ${wine.id}
      `
      updated++

      // Show progress every 100 wines
      if (updated % batchSize === 0) {
        console.log(`  Progress: ${updated}/${wines.length} wines updated`)
      }
    } catch (e: any) {
      console.error(`  Error updating wine ${wine.id}:`, e.message)
    }
  }

  console.log(`\n✨ Generated tasting notes for ${updated} wines`)

  // Show samples
  console.log('\n📝 Sample tasting notes:')
  const samples = await sql`
    SELECT name, tasting_notes
    FROM wines
    WHERE tasting_notes IS NOT NULL AND LENGTH(tasting_notes) > 100
    ORDER BY RANDOM()
    LIMIT 5
  `
  samples.forEach(s => {
    console.log(`\n--- ${s.name} ---`)
    console.log(s.tasting_notes)
  })
}

main().catch(console.error)
