"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max: number
  showLabel?: boolean
  animated?: boolean
}

export function ProgressBar({
  value,
  max,
  showLabel = true,
  animated = true,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100)
  
  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            진행률
          </span>
          <span className="text-sm font-medium text-gray-700">
            {value} / {max} ({Math.round(percentage)}%)
          </span>
        </div>
      )}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        {animated ? (
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ) : (
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        )}
        {percentage >= 100 && (
          <motion.div
            className="absolute inset-0 bg-green-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      {value >= 20 && value < max && (
        <p className="text-xs text-green-600 mt-1">
          최소 평가 개수를 달성했어요! 계속 평가하면 더 정확한 분석을 받을 수 있어요.
        </p>
      )}
    </div>
  )
}