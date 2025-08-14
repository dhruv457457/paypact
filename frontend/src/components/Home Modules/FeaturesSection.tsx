"use client";

import type React from "react";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FaWallet,
  FaShieldAlt,
  FaUsers,
  FaChartLine,
  FaGlobe,
  FaLock,
  FaBolt,
  FaEthereum,
  FaBitcoin,
  FaExchangeAlt,
  FaUserShield,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";
import { SiPolygon, SiSolana } from "react-icons/si";
import { Button } from "../UI/button";
import { Card, CardContent } from "../UI/card";

function ImprovedFeaturesSection() {
  return (
    <div className="min-h-screen py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Instant Payments Section */}
      <FeatureSection
        title="Send Money"
        subtitle="Instantly"
        description="Transfer funds across multiple blockchains in seconds, not minutes. PayPact's Web3 infrastructure ensures your payments reach their destination faster than traditional banking."
        visual={<InstantPaymentWidget />}
        reverse={false}
      />

      {/* Multi-Chain Support Section */}
      <FeatureSection
        title="Multi-Chain"
        subtitle="Support"
        description="Connect your wallets from Ethereum, Polygon, Solana, and more. One platform for all your Web3 payment needs with seamless cross-chain transactions."
        visual={<MultiChainWidget />}
        reverse={true}
      />

      {/* Trust & Security Section */}
      <FeatureSection
        title="Trust Scores &"
        subtitle="Security"
        description="Build your reputation with every transaction. Our decentralized trust system helps you transact confidently with verified users while maintaining complete privacy."
        visual={<TrustScoreWidget />}
        reverse={false}
      />
    </div>
  );
}

function FeatureSection({
  title,
  subtitle,
  description,
  visual,
  reverse = false,
}: {
  title: string;
  subtitle: string;
  description: string;
  visual: React.ReactNode;
  reverse?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className={`flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center justify-between px-8 py-20 lg:px-20 max-w-7xl mx-auto gap-16 relative z-10`}
    >
      <motion.div
        className="flex-1 text-center lg:text-left"
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        animate={
          isInView
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: reverse ? 50 : -50 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white">
          {title}
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(147,51,234,0.5)]">
            {subtitle}
          </span>
        </h2>
        <p className="text-xl lg:text-2xl leading-relaxed text-gray-300 mb-8">
          {description}
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(147,51,234,0.5)] hover:shadow-[0_0_40px_rgba(147,51,234,0.7)]"
        >
          Learn More
        </Button>
      </motion.div>
      <motion.div
        className="flex-1 flex justify-center"
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        animate={
          isInView
            ? { opacity: 1, x: 0 }
            : { opacity: 0, x: reverse ? -50 : 50 }
        }
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        {visual}
      </motion.div>
    </section>
  );
}

function InstantPaymentWidget() {
  return (
    <div className="relative w-80 h-80">
      {/* Background Circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-600/30 shadow-[0_0_50px_rgba(147,51,234,0.3)]"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Payment Cards */}
      <motion.div
        className="absolute top-16 left-16 w-32 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <FaCreditCard className="text-white text-2xl" />
      </motion.div>

      <motion.div
        className="absolute bottom-16 right-16 w-32 h-20 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <FaWallet className="text-white text-2xl" />
      </motion.div>

      {/* Lightning Bolt */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-purple-400 drop-shadow-[0_0_20px_rgba(147,51,234,0.8)]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <FaBolt />
      </motion.div>

      {/* Speed Lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-8 bg-gradient-to-t from-purple-600 to-transparent rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: "50% 140px",
            transform: `translateX(-50%) translateY(-50%) rotate(${i * 45}deg)`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function MultiChainWidget() {
  const chains = [
    { icon: <FaEthereum />, name: "Ethereum", color: "text-blue-400" },
    { icon: <FaBitcoin />, name: "Bitcoin", color: "text-orange-400" },
    { icon: <SiPolygon />, name: "Polygon", color: "text-purple-400" },
    { icon: <SiSolana />, name: "Solana", color: "text-green-400" },
  ];

  return (
    <div className="relative w-80 h-80">
      {/* Central Hub */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.6)]"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <FaExchangeAlt className="text-white text-2xl" />
      </motion.div>

      {/* Chain Icons */}
      {chains.map((chain, i) => (
        <motion.div
          key={i}
          className={`absolute w-16 h-16 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)] ${chain.color}`}
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: "50% -100px",
            transform: `translateX(-50%) translateY(-50%) rotate(${
              i * 90
            }deg) translateY(-100px) rotate(-${i * 90}deg)`,
          }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          whileHover={{ scale: 1.2 }}
        >
          <span className="text-2xl">{chain.icon}</span>
        </motion.div>
      ))}

      {/* Connection Lines */}
      {chains.map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute w-0.5 h-20 bg-gradient-to-t from-purple-600/50 to-transparent"
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: "50% 0",
            transform: `translateX(-50%) translateY(-50%) rotate(${i * 90}deg)`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function TrustScoreWidget() {
  return (
    <div className="relative w-80 h-80">
      {/* Trust Score Circle */}
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 border-4 border-green-400/30 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.3)]"
        animate={{
          borderColor: [
            "rgba(34, 197, 94, 0.3)",
            "rgba(59, 130, 246, 0.3)",
            "rgba(34, 197, 94, 0.3)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="text-6xl font-bold text-green-400 mb-2 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          98
        </motion.div>
        <div className="text-sm text-gray-300">Trust Score</div>
      </motion.div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-4 right-8 text-2xl text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <FaUserShield />
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-4 text-2xl text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <FaShieldAlt />
      </motion.div>

      <motion.div
        className="absolute top-16 left-8 text-xl text-purple-400 drop-shadow-[0_0_15px_rgba(147,51,234,0.6)]"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <FaUsers />
      </motion.div>
    </div>
  );
}

function BusinessToolsWidget() {
  const tools = [
    { icon: <FaChartLine />, name: "Analytics", color: "bg-blue-500" },
    { icon: <FaMoneyBillWave />, name: "Invoicing", color: "bg-green-500" },
    { icon: <FaLock />, name: "Escrow", color: "bg-purple-500" },
    { icon: <FaGlobe />, name: "API", color: "bg-orange-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-6 w-80">
      {tools.map((tool, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2, duration: 0.6 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card className="p-6 text-center hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all duration-300 bg-gray-900/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-0">
              <motion.div
                className={`w-16 h-16 ${tool.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-[0_0_20px_rgba(147,51,234,0.4)]`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {tool.icon}
              </motion.div>
              <h3 className="font-semibold text-white">{tool.name}</h3>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default ImprovedFeaturesSection;
