"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { NeonLogo } from "@/components/neon-logo"
import { V0Badge } from "@/components/v0-badge"
import dynamic from "next/dynamic"

// Dynamically import react-confetti to avoid SSR issues
const ReactConfetti = dynamic(() => import("react-confetti"), { ssr: false })

export default function NeonSpeedGame() {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "clicked" | "results">("idle")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const confettiTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Neon database provisioning time (in ms) - approximately 500ms
  const neonProvisioningTime = 500

  useEffect(() => {
    // Set window size for confetti
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const startGame = () => {
    setGameState("waiting")

    // Random delay between 2-6 seconds before turning green
    const randomDelay = Math.floor(Math.random() * 4000) + 2000

    timeoutRef.current = setTimeout(() => {
      setStartTime(Date.now())
      setGameState("ready")
    }, randomDelay)
  }

  const handleClick = () => {
    if (gameState === "waiting") {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setGameState("idle")
      return
    }

    if (gameState === "ready") {
      const endTime = Date.now()
      const timeTaken = endTime - (startTime || endTime)
      setReactionTime(timeTaken)
      setGameState("results")

      // Show confetti if player wins
      if (timeTaken < neonProvisioningTime) {
        setShowConfetti(true)

        // Stop confetti after 5 seconds
        confettiTimeoutRef.current = setTimeout(() => {
          setShowConfetti(false)
        }, 5000)
      }
    }
  }

  const resetGame = () => {
    setGameState("idle")
    setReactionTime(null)
    setStartTime(null)
    setShowConfetti(false)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Confetti overlay when player wins */}
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
          colors={["#00E599", "#12FFF7", "#B9FFB3", "#ffffff", "#22c55e"]}
        />
      )}

      {/* Header with logo */}
      <header className="w-full p-4 md:p-6 flex items-center">
        <a href="https://neon.tech/signup?ref=neon-speed-game" target="_blank" rel="noopener noreferrer">
          <NeonLogo className="h-6 md:h-8 w-auto hover:opacity-80 transition-opacity" />
        </a>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full mx-auto text-center">
          {gameState === "idle" && (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse">
                Neon Speed
              </h1>

              <p className="text-gray-300 mb-8 text-pretty">
                Are you able to react as fast as it takes to provision a Postgres database on Neon?
              </p>

              <Button
                onClick={startGame}
                className="w-full max-w-xs mx-auto text-black py-4 md:py-6 text-lg rounded-[0.375rem] border-0 shadow-lg bg-[#00E599] hover:bg-[#00e5bf]"
              >
                Start Game
              </Button>
            </>
          )}

          {(gameState === "waiting" || gameState === "ready") && (
            <div className="flex flex-col items-center">
              <h1
                className="text-5xl md:text-6xl font-bold mb-8 text-[#00E599] animate-pulse"
                style={{
                  textShadow:
                    "0 0 10px rgba(0, 229, 153, 0.7), 0 0 20px rgba(0, 229, 153, 0.5), 0 0 30px rgba(0, 229, 153, 0.3)",
                }}
              >
                Neon Speed
              </h1>

              <p className="text-gray-300 mb-8 text-xl">Get ready! Click when the square turns green.</p>

              <motion.div
                className={`w-80 h-80 rounded-none cursor-pointer flex items-center justify-center text-white font-bold text-3xl ${
                  gameState === "waiting" ? "bg-red-500" : "bg-green-500"
                }`}
                onClick={handleClick}
                animate={{
                  boxShadow:
                    gameState === "ready"
                      ? [
                          "0 0 0 0 rgba(74, 222, 128, 0)",
                          "0 0 20px 10px rgba(74, 222, 128, 0.7)",
                          "0 0 0 0 rgba(74, 222, 128, 0)",
                        ]
                      : "0 0 0 0 rgba(239, 68, 68, 0.5)",
                }}
                transition={{
                  repeat: gameState === "ready" ? Number.POSITIVE_INFINITY : 0,
                  duration: 1.5,
                }}
              >
                {gameState === "waiting" ? "Wait..." : "CLICK NOW!"}
              </motion.div>
            </div>
          )}

          {gameState === "results" && (
            <Card className="p-4 md:p-6 bg-[#1a1a1a] border-gray-800">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Results</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Your reaction time</p>
                  <p className="text-2xl font-bold text-green-400">{reactionTime} ms</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Provisioning a Postgres database on Neon takes</p>
                  <p className="text-2xl font-bold text-cyan-400">~{neonProvisioningTime} ms</p>
                </div>

                <div className="pt-4 border-t border-gray-800">
                  <p className="text-white">
                    {reactionTime && reactionTime < neonProvisioningTime
                      ? "Impressive! You beat Neon's average database provisioning time. Sign up for a free account to try it yourself! "
                      : "Don't feel bad - Neon's Postgres provisioning time is fast. Try it yourself with a free account"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="https://neon.tech/signup?ref=neon-speed-game"
                  className="block w-full py-3 bg-[#00E599] hover:bg-[#00e5bf] hover:to-cyan-600 text-black font-medium rounded-[0.375rem] text-center"
                >
                  Deploy Postgres
                </a>

                <Button
                  variant="outline"
                  onClick={resetGame}
                  className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Play Again
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer with v0 Badge */}
      <footer className="flex justify-center py-4 md:py-6">
        <V0Badge />
      </footer>
    </div>
  )
}
