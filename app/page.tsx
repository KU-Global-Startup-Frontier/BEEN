"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Sparkles, Target, Share2, BarChart3, Zap, Users, Star, TrendingUp, Brain, Heart, Palette, Code, Music, Camera } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)
  const [currentTestIndex, setCurrentTestIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  const viralTests = [
    { name: "관심사 분석", icon: Heart, color: "from-pink-500 to-rose-500" },
    { name: "강점 발견", icon: Star, color: "from-yellow-500 to-orange-500" },
    { name: "성향 테스트", icon: Brain, color: "from-purple-500 to-indigo-500" },
    { name: "창의력 지수", icon: Palette, color: "from-green-500 to-teal-500" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestIndex((prev) => (prev + 1) % viralTests.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x - 200,
            y: mousePosition.y - 200,
          }}
          transition={{ type: "spring", damping: 30 }}
        />
        <motion.div
          className="absolute right-0 top-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x / 10,
            y: mousePosition.y / 10,
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative container mx-auto px-4 py-20 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTestIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {viralTests[currentTestIndex].name} 시작하기
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8">
              <motion.span
                className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                BEEN
              </motion.span>
              <br />
              <motion.div className="text-3xl sm:text-4xl lg:text-5xl mt-4 space-y-2">
                {"나를 발견하는 5분".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-bold">100가지 활동</span>을 평가하고{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 font-bold">AI가 분석</span>한 당신의 관심 분야와 강점을{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold">시각적으로</span> 확인하세요.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Link href="/evaluate">
                <motion.button
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-lg overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 to-yellow-600"
                    initial={{ x: "-100%" }}
                    animate={{ x: isHovered ? 0 : "-100%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    <motion.span
                      animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      ✨
                    </motion.span>
                    지금 시작하기
                    <motion.div
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </motion.button>
              </Link>
              
              <motion.button
                className="px-8 py-4 border-2 border-white/20 rounded-2xl font-bold text-lg backdrop-blur-xl hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  샘플 결과 보기
                </span>
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm"
            >
              {[
                { icon: Users, text: "10,000+", label: "사용자" },
                { icon: Zap, text: "5분", label: "평균 소요" },
                { icon: Star, text: "4.9", label: "평점" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.7 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10"
                >
                  <stat.icon className="w-5 h-5 text-purple-400" />
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{stat.text}</span>
                    <span className="text-xs text-gray-400">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Viral Cards Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
              whileInView={{ scale: [0.8, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                인스타 터질
              </span>
              <br />
              <span className="text-white">
                결과 화면
              </span>
            </motion.h2>
            <p className="text-xl text-gray-400">
              친구들이 부러워할 나만의 분석 결과
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "IQ 수준",
                subtitle: "천재 레벨",
                value: "145",
                gradient: "from-purple-600 to-indigo-600",
                delay: 0,
              },
              {
                icon: Heart,
                title: "관심 분야",
                subtitle: "예술 & 창작",
                value: "98%",
                gradient: "from-pink-600 to-rose-600",
                delay: 0.1,
              },
              {
                icon: Palette,
                title: "창의력",
                subtitle: "상위 1%",
                value: "SSS",
                gradient: "from-yellow-600 to-orange-600",
                delay: 0.2,
              },
              {
                icon: Code,
                title: "논리력",
                subtitle: "개발자 타입",
                value: "A+",
                gradient: "from-green-600 to-teal-600",
                delay: 0.3,
              },
              {
                icon: Music,
                title: "감성 지수",
                subtitle: "예술가형",
                value: "89",
                gradient: "from-blue-600 to-cyan-600",
                delay: 0.4,
              },
              {
                icon: Camera,
                title: "시각 지능",
                subtitle: "디자이너",
                value: "S+",
                gradient: "from-red-600 to-pink-600",
                delay: 0.5,
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateY: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: card.delay, duration: 0.6 }}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl"
                  style={{
                    background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                />
                <div className={`relative bg-gradient-to-br ${card.gradient} p-[2px] rounded-3xl`}>
                  <div className="bg-black/90 backdrop-blur-xl rounded-3xl p-8 h-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute top-4 right-4 w-20 h-20 opacity-10"
                    >
                      <card.icon className="w-full h-full text-white" />
                    </motion.div>
                    
                    <div className="relative z-10">
                      <card.icon className="w-10 h-10 text-white mb-4" />
                      <h3 className="text-xl font-bold text-white mb-1">
                        {card.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        {card.subtitle}
                      </p>
                      <motion.div 
                        className="text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                        whileHover={{ scale: 1.1 }}
                      >
                        {card.value}
                      </motion.div>
                    </div>
                    
                    <motion.div
                      className="absolute bottom-4 right-4"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <Share2 className="w-5 h-5 text-white/50" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.3), transparent 50%)`,
          }}
        />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", damping: 10 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [-1, 1, -1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8">
                <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  지금 시작하면
                </span>
                <br />
                <span className="text-white">
                  친구들보다 먼저
                </span>
              </h2>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl text-gray-300 mb-12 font-light"
            >
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                무료
              </span>
              로 시작하고{" "}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                5분
              </span>
              만에 완료
            </motion.p>
            
            <Link href="/evaluate">
              <motion.button
                className="relative group px-12 py-6 text-xl font-black"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 rounded-full blur-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 rounded-full px-12 py-6">
                  <span className="flex items-center gap-3 text-white">
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🚀
                    </motion.span>
                    무료로 시작하기
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </span>
                </div>
              </motion.button>
            </Link>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex justify-center gap-4"
            >
              {["🔥", "✨", "💯", "🎯", "🚀"].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="text-3xl"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [-10, 10, -10]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}