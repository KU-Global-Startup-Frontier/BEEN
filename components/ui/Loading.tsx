"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function Loading({ size = "md", text, className }: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <motion.div
          className="absolute inset-0 border-4 border-blue-200 rounded-full"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {text && (
        <motion.p
          className="mt-4 text-gray-600 text-sm font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

export function LoadingOverlay({ text = "처리 중..." }: { text?: string }) {
  return (
    <motion.div
      className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Loading size="lg" text={text} />
    </motion.div>
  )
}