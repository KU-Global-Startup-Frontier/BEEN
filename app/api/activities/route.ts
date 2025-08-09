import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const supabase = createClient()
    
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*')
      .order('order_index', { ascending: true })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Error fetching activities:', error)
      return NextResponse.json(
        { error: 'Failed to fetch activities' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      activities: activities || [],
      total: activities?.length || 0,
      hasMore: (activities?.length || 0) === limit
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}