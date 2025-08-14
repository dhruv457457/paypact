"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import {
  FaBolt,
  FaShieldAlt,
  FaWallet,
  FaUsers,
  FaMoneyBillWave,
  FaBriefcase,
  FaEthereum,
  FaBitcoin,
} from "react-icons/fa"
import { SiPolygon, SiSolana } from "react-icons/si"
import { Button } from "../UI/button"

function ImprovedHero() {
  const [isVisible, setIsVisible] = useState(false)
  const controls = useAnimation()

  useEffect(() => {
    setIsVisible(true)
    controls.start("visible")
  }, [controls])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute text-6xl text-purple-400/30 drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          style={{ left: "10%", top: "20%" }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <FaEthereum />
        </motion.div>

        <motion.div
          className="absolute text-5xl text-blue-400/30 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          style={{ right: "15%", top: "30%" }}
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <FaBitcoin />
        </motion.div>

        <motion.div
          className="absolute text-4xl text-indigo-400/30 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          style={{ left: "20%", bottom: "25%" }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <SiPolygon />
        </motion.div>

        <motion.div
          className="absolute text-5xl text-violet-400/30 drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          style={{ right: "25%", bottom: "20%" }}
          animate={{
            y: [0, 12, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <SiSolana />
        </motion.div>

        <motion.div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 blur-3xl shadow-[0_0_100px_rgba(168,85,247,0.3)]"
          style={{ left: "-10%", top: "10%" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/40 to-indigo-600/40 blur-3xl shadow-[0_0_80px_rgba(59,130,246,0.3)]"
          style={{ right: "-5%", bottom: "15%" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-violet-600/30 to-purple-600/30 blur-2xl"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-6xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-400/30 text-purple-300 text-sm font-medium mb-8 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <FaEthereum className="text-lg drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <span>Powered by Web3 Technology</span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The Future of <br />
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            Digital Payments
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Send, receive, and manage money instantly with PayPact's secure Web3 platform. Built for speed, transparency,
          and trust in the decentralized economy.
        </motion.p>

        <motion.div
          className="flex justify-center items-center gap-6 flex-wrap mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Button
            size="lg"
            className="px-10 py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transform hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
          >
            Start Sending Money
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg font-semibold border-2 border-purple-400/50 hover:border-purple-400 hover:bg-purple-600/10 text-purple-300 hover:text-purple-200 transform hover:scale-105 transition-all duration-300 bg-transparent shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            View Demo →
          </Button>
        </motion.div>

        {/* Interactive Feature Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <InteractiveFeaturePill icon={<FaBolt />} text="Instant Transfers" delay={0.1} />
          <InteractiveFeaturePill icon={<FaShieldAlt />} text="Bank-Grade Security" delay={0.2} />
          <InteractiveFeaturePill icon={<FaWallet />} text="Multi-Chain Support" delay={0.3} />
          <InteractiveFeaturePill icon={<FaUsers />} text="Trust Scores" delay={0.4} />
          <InteractiveFeaturePill icon={<FaMoneyBillWave />} text="Zero Setup Fees" delay={0.5} />
        </motion.div>
      </motion.div>
    </section>
  )
}

function InteractiveFeaturePill({
  icon,
  text,
  delay = 0,
}: {
  icon: React.ReactNode
  text: string
  delay?: number
}) {
  return (
    <motion.div
      className="group flex items-center gap-3 border border-slate-700/50 rounded-full px-6 py-3 text-sm font-medium bg-slate-800/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:bg-slate-800/50 hover:border-purple-400/50 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        className="text-purple-400 group-hover:text-blue-400 transition-colors duration-300 drop-shadow-[0_0_5px_rgba(168,85,247,0.3)]"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.span>
      <span className="text-slate-300 group-hover:text-white transition-colors duration-300">{text}</span>
    </motion.div>
  )
}

export default ImprovedHero
