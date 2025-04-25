"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

interface ConfettiProps {
  active: boolean
  duration?: number
  colors?: string[]
}

export function Confetti({
  active,
  duration = 5000,
  colors = ["#00E599", "#12FFF7", "#B9FFB3", "#ffffff"],
}: ConfettiProps) {
  const [isActive, setIsActive] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (active) {
      setIsActive(true)
      const timer = setTimeout(() => {
        setIsActive(false)
      }, duration)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [active, duration])

  if (!isActive) return null

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.2}
      colors={colors}
    />
  )
}
