"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedTextProps {
  children: ReactNode
  className?: string
  delay?: number
  gradient?: string
}

export function AnimatedText({ 
  children, 
  className = "", 
  delay = 0,
  gradient = "from-purple-400 to-pink-400"
}: AnimatedTextProps) {
  const text = String(children)
  
  return (
    <motion.span className={`inline-block ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotate: -180 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ 
            delay: delay + i * 0.03,
            type: "spring",
            damping: 12,
            stiffness: 200
          }}
          className={`inline-block bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  )
}