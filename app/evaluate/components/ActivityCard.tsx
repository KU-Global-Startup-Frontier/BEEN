"use client"

import { motion, PanInfo } from "framer-motion"
import { Star, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface Activity {
  id: string
  name: string
  category: string
  description?: string
}

interface ActivityCardProps {
  activity: Activity
  onRate: (score: number) => void
  onStatusChange: (status: 'not_tried' | 'want_to_try' | null) => void
  onNext?: () => void
  onPrevious?: () => void
  currentRating?: number
  currentStatus?: 'not_tried' | 'want_to_try' | null
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
  onStatusChange,
  onNext,
  onPrevious,
  currentRating,
  currentStatus,
  index,
  total
}: ActivityCardProps) {
  const [dragX, setDragX] = useState(0)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5') {
        const score = parseInt(e.key)
        onRate(score)
      } else if (e.key === '0') {
        e.preventDefault()
        onStatusChange('not_tried')
      } else if (e.key === ' ') {
        e.preventDefault()
        onNext?.()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNext?.()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrevious?.()
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [onRate, onStatusChange, onNext, onPrevious])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    const velocity = info.velocity.x

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0) {
        // Dragged right - go to previous
        onPrevious?.()
      } else {
        // Dragged left - go to next
        onNext?.()
      }
    }
    setDragX(0)
  }

  const cardVariants = {
    initial: {
      scale: 0.95,
      opacity: 0,
      y: 20
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
        duration: 0.2
      }
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      x: dragX > 0 ? 300 : -300,
      transition: {
        duration: 0.15
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDrag={(_, info) => setDragX(info.offset.x)}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 0.98 }}
      className="perspective-1000 cursor-grab active:cursor-grabbing touch-none"
      style={{ x: dragX }}
    >
      <Card className="p-8 shadow-xl select-none pointer-events-auto">
        {/* Category Badge */}
        <div className="flex justify-center mb-6">
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            categoryColors[activity.category] || "bg-gray-100 text-gray-700"
          )}>
            {activity.category}
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
            이 활동을 얼마나 해봤는지 평가해 주세요
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

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex gap-3">
            <Button
              variant={currentStatus === 'not_tried' ? "default" : "outline"}
              size="lg"
              className={cn(
                "flex-1",
                currentStatus === 'not_tried' && "bg-gray-600 hover:bg-gray-700"
              )}
              onClick={() => onStatusChange(currentStatus === 'not_tried' ? null : 'not_tried')}
            >
              <X className="w-5 h-5 mr-2" />
              안 할거에요
            </Button>
            <Button
              variant={currentStatus === 'want_to_try' ? "default" : "outline"}
              size="lg"
              className={cn(
                "flex-1",
                currentStatus === 'want_to_try'
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              )}
              onClick={() => onStatusChange(currentStatus === 'want_to_try' ? null : 'want_to_try')}
            >
              <Star className={cn(
                "w-5 h-5 mr-2",
                currentStatus === 'want_to_try' ? "fill-white" : "fill-blue-600"
              )} />
              해보고 싶어요
            </Button>
          </div>
        </div>

        {/* Current Rating/Status Indicator */}
        {(currentRating !== undefined || currentStatus) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            <span className="text-sm text-green-600 font-medium">
              ✓ 평가 완료
              {currentRating !== undefined && ` (${currentRating}점)`}
              {currentStatus === 'not_tried' && " (안 할거에요)"}
              {currentStatus === 'want_to_try' && " (해보고 싶어요)"}
            </span>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}