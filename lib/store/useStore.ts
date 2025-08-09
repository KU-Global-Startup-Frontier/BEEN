import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateSessionId } from '@/lib/utils'

export interface Activity {
  id: string
  name: string
  category: string
  description?: string
  icon_url?: string
}

export interface Rating {
  activityId: string
  score: number // -1 for "안 해봤어요", 0-5 for ratings
}

export interface AnalysisResult {
  id: string
  categories: Array<{
    name: string
    score: number
  }>
  keywords: string[]
  strengths: string[]
  recommendations: Activity[]
  chartData: any
}

interface AppState {
  // Session
  sessionId: string
  
  // User
  userId: string | null
  
  // Ratings
  ratings: Map<string, number>
  ratedCount: number
  
  // Analysis
  analysisResult: AnalysisResult | null
  isAnalyzing: boolean
  
  // Actions
  initSession: () => void
  setUserId: (userId: string | null) => void
  setRating: (activityId: string, score: number) => void
  removeRating: (activityId: string) => void
  setAnalysisResult: (result: AnalysisResult) => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
  reset: () => void
  canAnalyze: () => boolean
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      sessionId: '',
      userId: null,
      ratings: new Map(),
      ratedCount: 0,
      analysisResult: null,
      isAnalyzing: false,
      
      // Actions
      initSession: () => {
        const sessionId = generateSessionId()
        set({ sessionId })
      },
      
      setUserId: (userId) => set({ userId }),
      
      setRating: (activityId, score) => {
        const { ratings } = get()
        const newRatings = new Map(ratings)
        
        // If rating exists and new score is different, update
        if (!ratings.has(activityId)) {
          newRatings.set(activityId, score)
          set({ 
            ratings: newRatings,
            ratedCount: newRatings.size
          })
        } else if (ratings.get(activityId) !== score) {
          newRatings.set(activityId, score)
          set({ ratings: newRatings })
        }
      },
      
      removeRating: (activityId) => {
        const { ratings } = get()
        const newRatings = new Map(ratings)
        newRatings.delete(activityId)
        set({ 
          ratings: newRatings,
          ratedCount: newRatings.size
        })
      },
      
      setAnalysisResult: (result) => set({ analysisResult: result }),
      
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      
      reset: () => set({
        ratings: new Map(),
        ratedCount: 0,
        analysisResult: null,
        isAnalyzing: false
      }),
      
      canAnalyze: () => {
        const { ratedCount } = get()
        return ratedCount >= 20
      }
    }),
    {
      name: 'been-storage',
      partialize: (state) => ({
        sessionId: state.sessionId,
        userId: state.userId,
        ratings: Array.from(state.ratings.entries()),
        ratedCount: state.ratedCount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.ratings) {
          // Convert array back to Map after rehydration
          const ratingsArray = state.ratings as unknown as [string, number][]
          state.ratings = new Map(ratingsArray)
        }
      }
    }
  )
)