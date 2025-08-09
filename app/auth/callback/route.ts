import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/evaluate'
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(new URL(`/?error=${error}`, requestUrl.origin))
  }

  if (code) {
    const supabase = await createClient()
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!sessionError) {
      // Get user info
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        console.log('User logged in:', user.email)
        // Store user ID in Zustand store if needed
      }
      
      return NextResponse.redirect(new URL(next, requestUrl.origin))
    } else {
      console.error('Session exchange error:', sessionError)
      return NextResponse.redirect(new URL(`/?error=session_error`, requestUrl.origin))
    }
  }

  // Return to home page if there's no code
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}