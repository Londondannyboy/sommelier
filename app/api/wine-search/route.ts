import { NextRequest, NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'c055cc4e61mshb21eca34cde5499p156733jsn174f7e5024de'
const RAPIDAPI_HOST = 'wine-explorer-api-ratings-insights-and-search.p.rapidapi.com'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || searchParams.get('wine_name')

  if (!query) {
    return NextResponse.json(
      { error: 'Missing search query. Use ?q=wine_name' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/search?wine_name=${encodeURIComponent(query)}`,
      {
        headers: {
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Wine API returned ${response.status}`)
    }

    const data = await response.json()

    // Transform the response to a more usable format
    const wines = data.items?.map((item: Record<string, string>) => {
      const [name, id] = Object.entries(item)[0]
      return { name, id }
    }) || []

    return NextResponse.json({
      query,
      count: wines.length,
      wines,
    })
  } catch (error) {
    console.error('[Wine Search API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to search wines', details: String(error) },
      { status: 500 }
    )
  }
}
