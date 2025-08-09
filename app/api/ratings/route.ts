import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { activityId, score, userId, isInterest } = body
    
    // Validate input
    if (!activityId || !userId) {
      return NextResponse.json(
        { error: 'Activity ID and user ID are required' },
        { status: 400 }
      )
    }
    
    // Validate score if provided (preference is 1-5, or we can use isInterest boolean)
    if (score !== undefined && score !== null) {
      if (score < 1 || score > 5) {
        return NextResponse.json(
          { error: 'Preference score must be between 1 and 5' },
          { status: 400 }
        )
      }
    }
    
    const supabase = createClient()
    
    // Prepare answer data for rt_user_answer table
    const answerData: any = {
      user_id: userId,
      question_id: parseInt(activityId),
      preference: score || null,
      is_interest: isInterest !== undefined ? isInterest : null,
    }
    
    // Check if an answer already exists for this user and question
    const { data: existingAnswer } = await supabase
      .from('rt_user_answer')
      .select('answer_id')
      .eq('user_id', userId)
      .eq('question_id', activityId)
      .single()
    
    let result
    if (existingAnswer) {
      // Update existing answer
      const { data, error } = await supabase
        .from('rt_user_answer')
        .update({
          preference: answerData.preference,
          is_interest: answerData.is_interest,
          timestamp: new Date().toISOString()
        })
        .eq('answer_id', existingAnswer.answer_id)
        .select()
        .single()
      
      result = { data, error }
    } else {
      // Insert new answer
      const { data, error } = await supabase
        .from('rt_user_answer')
        .insert(answerData)
        .select()
        .single()
      
      result = { data, error }
    }
    
    if (result.error) {
      console.error('Error saving answer:', result.error)
      return NextResponse.json(
        { error: 'Failed to save answer' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      answer: result.data
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
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = createClient()
    
    // Fetch answers from rt_user_answer table with question details
    const { data: answers, error } = await supabase
      .from('rt_user_answer')
      .select(`
        *,
        qt_question (
          question_id,
          question_name,
          major_category,
          minor_category
        )
      `)
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
    
    if (error) {
      console.error('Error fetching answers:', error)
      return NextResponse.json(
        { error: 'Failed to fetch answers' },
        { status: 500 }
      )
    }
    
    // Map the answers to a more friendly format
    const mappedAnswers = answers?.map(answer => ({
      answerId: answer.answer_id,
      questionId: answer.question_id,
      questionName: answer.qt_question?.question_name,
      category: answer.qt_question?.minor_category || answer.qt_question?.major_category,
      preference: answer.preference,
      isInterest: answer.is_interest,
      timestamp: answer.timestamp
    })) || []
    
    return NextResponse.json({
      answers: mappedAnswers,
      count: mappedAnswers.length
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}