import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const userId = searchParams.get('userId')
    const excludeRated = searchParams.get('excludeRated') === 'true'
    
    const supabase = createClient()
    
    // Debug: Check if we can connect to Supabase
    console.log('Attempting to fetch from qt_question table...')
    
    // First, get all questions from qt_question table
    let query = supabase
      .from('qt_question')
      .select('*')
    
    // If we need to exclude already rated questions and have a userId
    if (excludeRated && userId) {
      // Get already answered question IDs for this user
      const { data: answers } = await supabase
        .from('rt_user_answer')
        .select('question_id')
        .eq('user_id', userId)
      
      const answeredIds = answers?.map(a => a.question_id) || []
      
      if (answeredIds.length > 0) {
        query = query.not('question_id', 'in', `(${answeredIds.join(',')})`)
      }
    }
    
    // Execute the query
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
      console.error('Error fetching from qt_question table:', fetchError)
      throw fetchError
    }
    
    // Log the fetched data for debugging
    console.log('Fetched from qt_question:', allActivities?.length || 0, 'items')
    
    // If no data from qt_question, return empty array with message
    if (!allActivities || allActivities.length === 0) {
      console.warn('No data found in qt_question table')
      return NextResponse.json({
        activities: [],
        total: 0,
        hasMore: false,
        message: 'No questions found in qt_question table'
      })
    }
    
    // Map the qt_question data to match the expected activity structure
    const mappedActivities = allActivities.map(item => ({
      id: item.question_id?.toString() || '',
      name: item.question_name || '',
      category: item.minor_category || item.major_category || '',
      description: item.question_name || ''
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