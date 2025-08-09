"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { GoogleAuthButton } from "@/components/GoogleAuthButton"
import { UserProfile } from "@/components/UserProfile"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              BEEN
            </span>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {!loading && (
              user ? (
                <UserProfile />
              ) : (
                <GoogleAuthButton
                  text="로그인"
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                />
              )
            )}
          </div>
        </div>
      </div>
    </header>
  )
}