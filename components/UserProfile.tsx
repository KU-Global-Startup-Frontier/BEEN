"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/Button"
import { LogOut, User as UserIcon, Settings, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsDropdownOpen(false)
    window.location.href = "/"
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
    )
  }

  if (!user) {
    return null
  }

  const userMetadata = user.user_metadata || {}
  const displayName = userMetadata.full_name || userMetadata.name || user.email?.split('@')[0] || 'User'
  const avatarUrl = userMetadata.avatar_url || userMetadata.picture
  const email = user.email || ''

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 transition-colors group"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-purple-400/50 group-hover:border-purple-400 transition-colors"
          />
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-medium text-white max-w-[120px] md:max-w-[150px] truncate">
            {displayName}
          </span>
          <span className="text-xs text-gray-400 max-w-[120px] md:max-w-[150px] truncate">
            {email}
          </span>
        </div>
        
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-10 h-10 rounded-full border-2 border-purple-400/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate">{email}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  // Navigate to profile page when implemented
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                프로필
              </button>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false)
                  // Navigate to settings page when implemented
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                설정
              </button>
              
              <div className="my-2 border-t border-white/10" />
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}