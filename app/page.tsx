"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { NeonLogo } from "@/components/neon-logo"
import { V0Badge } from "@/components/v0-badge"

export default function NeonSpeedGame() {
  const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "clicked" | "results">("idle")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Neon database provisioning time (in ms) - approximately 500ms
  const neonProvisioningTime = 500

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
    }
  }

  const resetGame = () => {
    setGameState("idle")
    setReactionTime(null)
    setStartTime(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-black p-4 relative">
      <div className="absolute top-10 left-10">
        <a href="https://neon.tech/signup?ref=neon-speed-game" target="_blank" rel="noopener noreferrer">
          <NeonLogo className="h-8 w-auto hover:opacity-80 transition-opacity" />
        </a>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center">
          <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 animate-pulse">
            Neon Speed
          </h1>

          <p className="text-gray-300 mb-8 text-pretty">
            Are you able to react as fast as it takes to provision a Postgres database on Neon?
          </p>

          {gameState === "idle" && (
            <Button
              onClick={startGame}
              className="w-full max-w-xs text-black py-6 text-lg rounded-md  border-0 shadow-lg bg-[#00E599] hover:bg-[#00e5bf]"
            >
              Start Game
            </Button>
          )}

          {(gameState === "waiting" || gameState === "ready") && (
            <div className="mb-8">
              <motion.div
                className={`w-64 h-64 mx-auto rounded-lg cursor-pointer flex items-center justify-center text-white font-bold text-xl ${
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

              <p className="text-gray-300 mt-4">
                {gameState === "waiting" ? "Get ready! Click when the square turns green." : "Click now!"}
              </p>
            </div>
          )}

          {gameState === "results" && (
            <Card className="p-6 bg-gray-900 border-gray-800">
              <h2 className="text-2xl font-bold text-white mb-4">Results</h2>

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
                      ? "Impressive! Your reflexes beat Neon's average database provisioning time."
                      : "Don't feel bad - Neon's Postgres provisioning time is fast. Try it yourself with a free account"}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href="https://neon.tech/signup?ref=neon-speed-game"
                  className="block w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-medium rounded-md text-center"
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
      </div>

      {/* v0 Badge at bottom center */}
      <div className="flex justify-center mt-8 mb-4">
        <V0Badge />
      </div>
    </div>
  )
}
