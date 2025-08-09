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
    
    // Debug: Check if we can connect to Supabase
    console.log('Attempting to fetch from quetion_raw table...')
    
    // First, get all questions from quetion_raw table with random ordering
    let query = supabase
      .from('quetion_raw')
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
    const { data: allActivities, error: fetchError, status, statusText } = await query
    
    // Debug: Log complete response details
    console.log('Query response:', {
      status,
      statusText,
      dataLength: allActivities?.length || 0,
      error: fetchError,
      sampleData: allActivities?.[0] // Log first item to see structure
    })
    
    if (fetchError) {
      console.error('Error fetching from quetion_raw table:', fetchError)
      throw fetchError
    }
    
    // Log the fetched data for debugging
    console.log('Fetched from quetion_raw:', allActivities?.length || 0, 'items')
    
    // If no data from quetion_raw, return empty array with message
    if (!allActivities || allActivities.length === 0) {
      console.warn('No data found in quetion_raw table')
      return NextResponse.json({
        activities: [],
        total: 0,
        hasMore: false,
        message: 'No questions found in quetion_raw table'
      })
    }
    
    // Map the quetion_raw data to match the expected activity structure
    const mappedActivities = allActivities.map(item => ({
      id: item.id?.toString() || '',
      name: item.question_name || '',
      category: item.minor_category || item.major_category || '',
      description: item.description || ''
    }))
    
    // Shuffle the activities array using Fisher-Yates algorithm
    const shuffled = [...mappedActivities]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    // Apply pagination to the shuffled array
    const activities = shuffled.slice(offset, offset + limit)
    
    return NextResponse.json({
      activities: activities || [],
      total: shuffled.length,
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