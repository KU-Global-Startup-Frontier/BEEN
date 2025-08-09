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
  // 20개를 기준으로 진행률 계산
  const progressToMinimum = Math.min(100, (value / 20) * 100)
  const percentage = Math.min(100, (value / max) * 100)
  
  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {value < 20 ? '즉시 결과보기까지' : '전체 진행률'}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {value < 20 ? `${20 - value}개 남음` : `${value}개 평가 완료`}
          </span>
        </div>
      )}
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        {animated ? (
          <motion.div
            className={`absolute left-0 top-0 h-full rounded-full ${
              value < 20 
                ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: value < 20 ? `${progressToMinimum}%` : `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ) : (
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${
              value < 20 
                ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}
            style={{ width: value < 20 ? `${progressToMinimum}%` : `${percentage}%` }}
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
      {value === 20 && (
        <motion.p 
          className="text-xs text-green-600 mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          축하해요! 이제 결과를 볼 수 있어요 🎉
        </motion.p>
      )}
      {value > 20 && value < 50 && (
        <p className="text-xs text-blue-600 mt-1">
          계속 평가하면 더 정확한 분석을 받을 수 있어요.
        </p>
      )}
      {value >= 50 && value < max && (
        <p className="text-xs text-purple-600 mt-1">
          훌륭해요! 고품질 분석을 위한 충분한 데이터를 모았어요.
        </p>
      )}
    </div>
  )
}