import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { activityId, score, sessionId, userId } = body
    
    // Validate input
    if (!activityId || score === undefined || score === null) {
      return NextResponse.json(
        { error: 'Activity ID and score are required' },
        { status: 400 }
      )
    }
    
    if (score < -1 || score > 5) {
      return NextResponse.json(
        { error: 'Score must be between -1 and 5' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    // Prepare rating data
    const ratingData: any = {
      activity_id: activityId,
      score: score,
    }
    
    if (userId) {
      ratingData.user_id = userId
    } else if (sessionId) {
      ratingData.session_id = sessionId
    } else {
      return NextResponse.json(
        { error: 'Either userId or sessionId is required' },
        { status: 400 }
      )
    }
    
    // Upsert rating (update if exists, insert if not)
    const { data, error } = await supabase
      .from('ratings')
      .upsert(ratingData, {
        onConflict: userId ? 'user_id,activity_id' : 'session_id,activity_id'
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error saving rating:', error)
      return NextResponse.json(
        { error: 'Failed to save rating' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      rating: data
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const userId = searchParams.get('userId')
    
    if (!sessionId && !userId) {
      return NextResponse.json(
        { error: 'Either sessionId or userId is required' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    let query = supabase.from('ratings').select('*')
    
    if (userId) {
      query = query.eq('user_id', userId)
    } else if (sessionId) {
      query = query.eq('session_id', sessionId)
    }
    
    const { data: ratings, error } = await query
    
    if (error) {
      console.error('Error fetching ratings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch ratings' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      ratings: ratings || [],
      count: ratings?.length || 0
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}