"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function FloatingElements() {
  const [elements, setElements] = useState<Array<{
    id: number
    x: number
    y: number
    duration: number
    delay: number
  }>>([])

  useEffect(() => {
    // 클라이언트 사이드에서만 랜덤 값 생성
    const newElements = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }))
    setElements(newElements)
  }, [])

  if (elements.length === 0) {
    return null // 초기 렌더링 시 아무것도 표시하지 않음
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          initial={{
            x: element.x,
            y: element.y,
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            delay: element.delay,
          }}
        />
      ))}
    </div>
  )
}