"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface FloatingCardProps {
  children: ReactNode
  className?: string
  delay?: number
  floatRange?: number
}

export function FloatingCard({ 
  children, 
  className = "",
  delay = 0,
  floatRange = 20
}: FloatingCardProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 10,
        z: 50,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div
        animate={{
          y: [-floatRange/2, floatRange/2, -floatRange/2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}