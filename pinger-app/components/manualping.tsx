"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Zap, CheckCircle, XCircle } from "lucide-react"

export default function PingButton() {
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [pingCount, setPingCount] = useState(0)
  const [lastPingTime, setLastPingTime] = useState<Date | null>(null)

  const handleManualPing = async () => {
    setLoading(true)
    setMessage("")
    const startTime = Date.now()

    try {
      const res = await fetch("/api/j15-ping")
      const json = await res.json()
      const responseTime = Date.now() - startTime

      setPingCount((prev) => prev + 1)
      setLastPingTime(new Date())

      if (json.success) {
        setMessage(`✓ Ping #${pingCount + 1} successful (${responseTime}ms)\n${JSON.stringify(json, null, 2)}`)
      } else {
        setMessage(`✗ Ping #${pingCount + 1} failed\n${JSON.stringify(json, null, 2)}`)
      }
    } catch (err) {
      const responseTime = Date.now() - startTime
      setPingCount((prev) => prev + 1)
      setLastPingTime(new Date())
      setMessage(`✗ Ping #${pingCount + 1} failed (${responseTime}ms)\nError: Network request failed`)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800 rounded-lg border border-gray-700 h-fit"
    >
      {/* Window Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 rounded-t-lg border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Terminal className="w-4 h-4" />
          <span className="text-sm">manual-ping.exe</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4"></div>
          <div className="w-4 h-4"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 bg-black text-green-400 rounded-b-lg font-mono">
        {/* Command Header */}
        <div className="flex items-center space-x-2 mb-4 text-cyan-400 text-sm">
          <Terminal className="w-4 h-4" />
          <span>Manual Ping Interface</span>
        </div>

        {/* Command Input Area */}
        <div className="bg-gray-900 border border-gray-600 rounded p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2 text-sm">
            <span className="text-cyan-400">user@ping-monitor:~$</span>
            <span className="text-green-400">ping --manual j15-endpoint</span>
          </div>

          {/* Ping Button */}
          <motion.button
            onClick={handleManualPing}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded border transition-all duration-200 text-sm w-full sm:w-auto
              ${
                loading
                  ? "bg-yellow-900 border-yellow-600 text-yellow-400 cursor-not-allowed"
                  : "bg-green-900 border-green-600 text-green-400 hover:bg-green-800 hover:border-green-500"
              }
            `}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"
                />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Execute Manual Ping</span>
              </>
            )}
          </motion.button>

          {/* Stats */}
          {(pingCount > 0 || lastPingTime) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span>Total pings: {pingCount}</span>
                {lastPingTime && <span>Last: {formatTime(lastPingTime)}</span>}
              </div>
            </motion.div>
          )}
        </div>

        {/* Output Area */}
        <AnimatePresence>
          {(loading || message) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-900 border border-gray-600 rounded p-3 mb-4"
            >
              <div className="flex items-center space-x-2 mb-2 text-cyan-400 text-sm">
                <span>Output:</span>
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        PING j15-endpoint...
                      </motion.div>
                    </div>
                    <div className="text-gray-500 text-xs">Waiting for response...</div>
                  </motion.div>
                ) : message ? (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-2"
                  >
                    <div className="flex items-start space-x-2">
                      {message.includes("successful") ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className={`text-xs ${message.includes("successful") ? "text-green-400" : "text-red-400"}`}>
                        <pre className="whitespace-pre-wrap font-mono overflow-x-auto">{message}</pre>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Command Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center space-x-2 text-cyan-400 text-sm"
        >
          <span>user@ping-monitor:~$</span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="bg-green-400 text-black px-1"
          >
            _
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  )
}
