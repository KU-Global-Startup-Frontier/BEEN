import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, gender, age } = body
    
    const supabase = createClient()
    
    // First check if user already exists with this email
    if (email) {
      const { data: existingUser } = await supabase
        .from('ut_user')
        .select('*')
        .eq('email', email)
        .single()
      
      if (existingUser) {
        return NextResponse.json({
          user: existingUser,
          isNew: false
        })
      }
    }
    
    // Create new user
    const userData: any = {
      user_name: name || 'Anonymous User',
      email: email || null,
      gender: gender || null,
      age: age || null
    }
    
    const { data: newUser, error } = await supabase
      .from('ut_user')
      .insert(userData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      user: newUser,
      isNew: true
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
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')
    
    const supabase = createClient()
    
    let query = supabase.from('ut_user').select('*')
    
    if (userId) {
      query = query.eq('user_id', userId)
    } else if (email) {
      query = query.eq('email', email)
    } else {
      return NextResponse.json(
        { error: 'Either email or userId is required' },
        { status: 400 }
      )
    }
    
    const { data: user, error } = await query.single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // User not found
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }
      console.error('Error fetching user:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}