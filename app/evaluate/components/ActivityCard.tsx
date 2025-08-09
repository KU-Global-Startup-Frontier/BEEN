"use client"

import { motion } from "framer-motion"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface Activity {
  id: string
  name: string
  category: string
  description?: string
}

interface ActivityCardProps {
  activity: Activity
  onRate: (score: number) => void
  currentRating?: number
  index: number
  total: number
}

const categoryColors: Record<string, string> = {
  "창작": "bg-purple-100 text-purple-700",
  "운동": "bg-green-100 text-green-700",
  "학습": "bg-blue-100 text-blue-700",
  "사회활동": "bg-yellow-100 text-yellow-700",
  "기술": "bg-indigo-100 text-indigo-700",
  "비즈니스": "bg-red-100 text-red-700",
  "예술": "bg-pink-100 text-pink-700",
  "취미": "bg-orange-100 text-orange-700",
}

export function ActivityCard({ 
  activity, 
  onRate, 
  currentRating,
  index,
  total 
}: ActivityCardProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '5') {
        const score = e.key === '0' ? -1 : parseInt(e.key)
        onRate(score)
      } else if (e.key === ' ') {
        e.preventDefault()
        // Skip functionality would be handled by parent
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [onRate])

  const cardVariants = {
    initial: { 
      scale: 0.9, 
      opacity: 0, 
      y: 50,
      rotateY: -180 
    },
    animate: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      scale: 0.9, 
      opacity: 0, 
      x: -300,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="perspective-1000"
    >
      <Card className="p-8 shadow-xl">
        {/* Category Badge */}
        <div className="flex justify-between items-center mb-6">
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            categoryColors[activity.category] || "bg-gray-100 text-gray-700"
          )}>
            {activity.category}
          </span>
          <span className="text-sm text-gray-500">
            {index + 1} / {total}
          </span>
        </div>

        {/* Activity Name */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">
          {activity.name}
        </h2>

        {/* Description */}
        {activity.description && (
          <p className="text-gray-600 text-center mb-8">
            {activity.description}
          </p>
        )}

        {/* Rating Stars */}
        <div className="space-y-4">
          <p className="text-sm text-gray-500 text-center">
            이 활동에 대한 관심도를 평가해주세요
          </p>
          
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <motion.button
                key={score}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRate(score)}
                className={cn(
                  "p-3 rounded-lg transition-all",
                  currentRating === score 
                    ? "bg-yellow-100" 
                    : "hover:bg-gray-100"
                )}
              >
                <Star 
                  className={cn(
                    "w-8 h-8 transition-colors",
                    currentRating && currentRating >= score
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  )}
                />
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3 text-xs text-gray-500 justify-between px-4">
            <span>전혀 관심 없음</span>
            <span>매우 관심 있음</span>
          </div>
        </div>

        {/* Never Tried Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => onRate(-1)}
          >
            <X className="w-5 h-5 mr-2" />
            안 해봤어요
          </Button>
        </div>

        {/* Current Rating Indicator */}
        {currentRating !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <span className="text-sm text-green-600 font-medium">
              ✓ 평가 완료 
              {currentRating === -1 
                ? " (안 해봤어요)" 
                : ` (${currentRating}점)`
              }
            </span>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}