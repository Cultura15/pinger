"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Wifi, WifiOff, Terminal, Minimize2, Square, X } from "lucide-react"

type PingResult = {
  success: boolean
  message: string
  data?: any
}

export default function HomePage() {
  const [pingResult, setPingResult] = useState<PingResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEnabled, setIsEnabled] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCursor, setShowCursor] = useState(true)
  const [typedText, setTypedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  const welcomeText = "Initializing Ping Monitor v2.1.0..."

  // Typing animation effect
  useEffect(() => {
    if (isTyping && typedText.length < welcomeText.length) {
      const timeout = setTimeout(() => {
        setTypedText(welcomeText.slice(0, typedText.length + 1))
      }, 50)
      return () => clearTimeout(timeout)
    } else if (typedText.length === welcomeText.length) {
      setIsTyping(false)
    }
  }, [typedText, isTyping])

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchPing = async () => {
    if (!isEnabled) return

    setLoading(true)
    try {
      const res = await fetch("/api/j15-ping")
      const data = await res.json()
      setPingResult(data)
    } catch (err) {
      setPingResult({
        success: false,
        message: "Failed to reach endpoint.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPing()
    const interval = setInterval(fetchPing, 60000)
    return () => clearInterval(interval)
  }, [isEnabled])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-black p-4 font-mono">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Terminal Window Frame */}
        <div className="bg-gray-800 rounded-t-lg border border-gray-700">
          {/* Window Controls */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-900 rounded-t-lg border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Terminal className="w-4 h-4" />
              <span className="text-sm">ping-monitor.exe</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Minimize2 className="w-4 h-4 hover:text-white cursor-pointer" />
              <Square className="w-4 h-4 hover:text-white cursor-pointer" />
              <X className="w-4 h-4 hover:text-red-400 cursor-pointer" />
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 bg-black text-green-400 min-h-[600px] rounded-b-lg">
            {/* Header */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-cyan-400">[{formatTime(currentTime)}] user@ping-monitor:~$</div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Monitor Status:</span>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={setIsEnabled}
                      className="data-[state=checked]:bg-green-600"
                    />
                    {isEnabled ? (
                      <Wifi className="w-4 h-4 text-green-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="text-green-400">
                {typedText}
                {(isTyping || showCursor) && (
                  <motion.span animate={{ opacity: showCursor ? 1 : 0 }} className="bg-green-400 text-black px-1">
                    _
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Status Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className="text-cyan-400 mb-2">{">"} ping status --monitor j15-endpoint</div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2 text-yellow-400"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"
                    />
                    <span>Pinging endpoint...</span>
                  </motion.div>
                ) : !isEnabled ? (
                  <motion.div
                    key="disabled"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-500"
                  >
                    Monitor disabled. Enable to start pinging.
                  </motion.div>
                ) : pingResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Status:</span>
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`px-2 py-1 rounded text-sm font-bold ${
                          pingResult.success
                            ? "bg-green-900 text-green-400 border border-green-600"
                            : "bg-red-900 text-red-400 border border-red-600"
                        }`}
                      >
                        {pingResult.success ? "● ONLINE" : "● OFFLINE"}
                      </motion.span>
                    </div>

                    <div className="text-gray-300">Response: {pingResult.message}</div>

                    {pingResult.data && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 0.2 }}
                        className="mt-4"
                      >
                        <div className="text-cyan-400 mb-2">{">"} cat response.json</div>
                        <div className="bg-gray-900 border border-gray-700 rounded p-4 overflow-auto">
                          <pre className="text-green-300 text-sm">{JSON.stringify(pingResult.data, null, 2)}</pre>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>

            {/* System Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-4 border-t border-gray-800"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-gray-400">
                  <span className="text-cyan-400">Uptime:</span> {formatTime(currentTime)}
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">Interval:</span> 60s
                </div>
                <div className="text-gray-400">
                  <span className="text-cyan-400">Protocol:</span> HTTP/HTTPS
                </div>
              </div>
            </motion.div>

            {/* Command Prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 flex items-center space-x-2"
            >
              <span className="text-cyan-400">user@ping-monitor:~$</span>
              <motion.span animate={{ opacity: showCursor ? 1 : 0 }} className="bg-green-400 text-black px-1">
                _
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
