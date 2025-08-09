import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sessionId = searchParams.get('sessionId')
    const excludeRated = searchParams.get('excludeRated') === 'true'
    
    const supabase = createClient()
    
    // First, get all questions from question_raw table with random ordering
    let query = supabase
      .from('question_raw')
      .select('*')
    
    // If we need to exclude already rated questions
    if (excludeRated && sessionId) {
      // Get already rated activity IDs for this session
      const { data: ratings } = await supabase
        .from('ratings')
        .select('activity_id')
        .eq('session_id', sessionId)
      
      const ratedIds = ratings?.map(r => r.activity_id) || []
      
      if (ratedIds.length > 0) {
        query = query.not('id', 'in', `(${ratedIds.join(',')})`)
      }
    }
    
    // For random ordering in Supabase, we need to use a different approach
    // First get all questions, then shuffle them
    const { data: allActivities, error: fetchError } = await query
    
    if (fetchError) {
      throw fetchError
    }
    
    // Shuffle the activities array using Fisher-Yates algorithm
    const shuffled = [...(allActivities || [])]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    // Apply pagination to the shuffled array
    const activities = shuffled.slice(offset, offset + limit)
    const error = fetchError
    
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