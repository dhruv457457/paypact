"use client"

import { cn } from "../../lib/utils"
import { BentoGrid, BentoGridItem } from "../UI/bento-grid"
import {
  FaWallet,
  FaUsers,
  FaChartLine,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaEthereum,
  FaBitcoin,
  FaCreditCard,
  FaUserShield,
  FaBolt,
} from "react-icons/fa"
import { SiPolygon, SiSolana } from "react-icons/si"
import { motion } from "framer-motion"

export function BentoGridSection() {
  return (
    <section className="py-20 px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
    
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the powerful features that make PayPact the ultimate Web3 payment platform for individuals and
            businesses.
          </p>
        </motion.div>

        <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <BentoGridItem
                title={item.title}
                description={item.description}
                header={item.header}
                className={cn(
                  "hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] hover:scale-[1.02] transition-all duration-300 bg-black",
                  item.className,
                )}
                icon={item.icon}
              />
            </motion.div>
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}

const PaymentTransactionDemo = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-black rounded-lg flex-col space-y-3 p-4"
    >
      {/* Sender */}
      <motion.div
        variants={{
          initial: { x: 0, opacity: 0.7 },
          animate: { x: 10, opacity: 1 },
        }}
        className="flex flex-row rounded-full border border-purple-600/20 p-3 items-center space-x-3 bg-gray-900/50 shadow-[0_0_15px_rgba(147,51,234,0.2)]"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
          <FaWallet className="text-white text-sm" />
        </div>
        <div className="flex-1 bg-gray-700 h-3 rounded-full" />
        <div className="text-xs text-gray-300">$500</div>
      </motion.div>

      {/* Transaction Arrow */}
      <motion.div
        className="flex justify-center"
        variants={{
          initial: { scale: 1 },
          animate: { scale: 1.2 },
        }}
      >
        <FaBolt className="text-purple-400 text-xl drop-shadow-[0_0_10px_rgba(147,51,234,0.6)]" />
      </motion.div>

      {/* Receiver */}
      <motion.div
        variants={{
          initial: { x: 0, opacity: 0.7 },
          animate: { x: -10, opacity: 1 },
        }}
        className="flex flex-row rounded-full border border-blue-600/20 p-3 items-center space-x-3 bg-gray-900/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] ml-auto w-4/5"
      >
        <div className="text-xs text-gray-300">Received</div>
        <div className="flex-1 bg-gray-700 h-3 rounded-full" />
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
          <FaUserShield className="text-white text-sm" />
        </div>
      </motion.div>
    </motion.div>
  )
}

const MultiChainNetwork = () => {
  const chains = [
    { icon: <FaEthereum />, color: "from-blue-500 to-blue-600" },
    { icon: <FaBitcoin />, color: "from-orange-500 to-orange-600" },
    { icon: <SiPolygon />, color: "from-purple-500 to-purple-600" },
    { icon: <SiSolana />, color: "from-green-500 to-green-600" },
  ]

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-black rounded-lg flex-col justify-center items-center p-4"
    >
      <div className="grid grid-cols-2 gap-4 w-full max-w-32">
        {chains.map((chain, i) => (
          <motion.div
            key={i}
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${chain.color} flex items-center justify-center text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]`}
            variants={{
              initial: { scale: 1, rotate: 0 },
              animate: { scale: [1, 1.1, 1], rotate: [0, 5, 0] },
              hover: { scale: 1.2, rotate: 360 },
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          >
            {chain.icon}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-4 text-center"
        variants={{
          initial: { opacity: 0.7 },
          hover: { opacity: 1 },
        }}
      >
        <div className="text-xs text-gray-300">Cross-Chain Compatible</div>
      </motion.div>
    </motion.div>
  )
}

const TrustScoreDisplay = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-black rounded-lg flex-col justify-center items-center p-4"
    >
      <motion.div
        className="relative w-24 h-24 rounded-full border-4 border-green-500/30 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
        variants={{
          initial: { scale: 1 },
          animate: { scale: [1, 1.05, 1] },
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        <motion.div
          className="text-2xl font-bold text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]"
          variants={{
            initial: { opacity: 0.8 },
            animate: { opacity: 1 },
          }}
        >
          98
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-green-500"
          style={{
            background: `conic-gradient(from 0deg, #10b981 ${98 * 3.6}deg, transparent ${98 * 3.6}deg)`,
          }}
          variants={{
            initial: { rotate: 0 },
            animate: { rotate: 360 },
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>
      <div className="text-xs text-gray-300 text-center">Trust Score</div>
    </motion.div>
  )
}

const BusinessAnalytics = () => {
  const data = [40, 65, 45, 80, 60, 75, 90]

  return (
    <motion.div
      initial="initial"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-black rounded-lg p-4"
    >
      <div className="w-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold text-white">Revenue</div>
          <div className="text-xs text-green-400">+24%</div>
        </div>
        <div className="flex items-end space-x-1 h-16">
          {data.map((height, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-t from-purple-600 to-blue-600 rounded-sm flex-1 shadow-[0_0_10px_rgba(147,51,234,0.4)]"
              style={{ height: `${height}%` }}
              variants={{
                initial: { scaleY: 0.3 },
                hover: { scaleY: 1 },
              }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-300 mt-2">Last 7 days</div>
      </div>
    </motion.div>
  )
}

const PaymentMethods = () => {
  const methods = [
    { icon: <FaCreditCard />, name: "Card" },
    { icon: <FaWallet />, name: "Wallet" },
    { icon: <FaEthereum />, name: "ETH" },
    { icon: <FaBitcoin />, name: "BTC" },
  ]

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] bg-black rounded-lg p-4"
    >
      <div className="grid grid-cols-2 gap-3 w-full">
        {methods.map((method, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-purple-600/30 transition-colors shadow-[0_0_10px_rgba(147,51,234,0.1)]"
            variants={{
              initial: { scale: 1, opacity: 0.8 },
              animate: { scale: [1, 1.05, 1], opacity: 1 },
            }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="text-lg text-purple-400 mb-1">{method.icon}</div>
            <div className="text-xs text-gray-300">{method.name}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const items = [
  {
    title: "Instant Payments",
    description: "Send and receive money in seconds across multiple blockchains with real-time confirmation.",
    header: <PaymentTransactionDemo />,
    className: "md:col-span-2",
    icon: <FaBolt className="h-4 w-4 text-purple-400" />,
  },
  {
    title: "Multi-Chain Support",
    description: "Connect wallets from Ethereum, Bitcoin, Polygon, Solana, and more in one unified platform.",
    header: <MultiChainNetwork />,
    className: "md:col-span-1",
    icon: <FaExchangeAlt className="h-4 w-4 text-purple-400" />,
  },
  {
    title: "Trust & Reputation",
    description: "Build your reputation with every transaction. Our decentralized trust system ensures safe payments.",
    header: <TrustScoreDisplay />,
    className: "md:col-span-1",
    icon: <FaUsers className="h-4 w-4 text-purple-400" />,
  },
  {
    title: "Business Analytics",
    description: "Track your payment performance with detailed analytics and insights for better decision making.",
    header: <BusinessAnalytics />,
    className: "md:col-span-1",
    icon: <FaChartLine className="h-4 w-4 text-purple-400" />,
  },
  {
    title: "Multiple Payment Methods",
    description: "Accept payments via cards, crypto wallets, bank transfers, and digital currencies seamlessly.",
    header: <PaymentMethods />,
    className: "md:col-span-1",
    icon: <FaMoneyBillWave className="h-4 w-4 text-purple-400" />,
  },
]
