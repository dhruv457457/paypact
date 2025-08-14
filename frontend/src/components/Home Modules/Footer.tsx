"use client"

import type React from "react"
import { motion } from "framer-motion"
import {
  FaTwitter,
  FaDiscord,
  FaTelegram,
  FaGithub,
  FaEthereum,
  FaBitcoin,
  FaShieldAlt,
  FaBolt,
  FaUsers,
  FaChartLine,
} from "react-icons/fa"
import { SiPolygon, SiSolana } from "react-icons/si"
import { Button } from "../UI/button"

function ImprovedFooter() {
  return (
    <footer className="relative py-20 px-6 border-t border-gray-800 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>


      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="text-3xl font-bold text-white">PayPact</div>
            </div>
            <p className="text-gray-300 mb-6">
              The future of Web3 payments. Secure, fast, and built for the decentralized economy.
            </p>
            {/* Web3 Badges */}
            <div className="flex flex-wrap gap-2">
              <Web3Badge icon={<FaEthereum />} text="Ethereum" />
              <Web3Badge icon={<FaBitcoin />} text="Bitcoin" />
              <Web3Badge icon={<SiPolygon />} text="Polygon" />
              <Web3Badge icon={<SiSolana />} text="Solana" />
            </div>
          </motion.div>

          {/* Features Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Key Features</h3>
            <div className="space-y-4">
              <FeatureItem icon={<FaBolt />} text="Instant Transfers" />
              <FeatureItem icon={<FaShieldAlt />} text="Bank-Grade Security" />
              <FeatureItem icon={<FaUsers />} text="Trust Scores" />
              <FeatureItem icon={<FaChartLine />} text="Business Analytics" />
            </div>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white">Product</h4>
            <div className="space-y-4">
              <FooterLink text="Personal Wallet" />
              <FooterLink text="Business Solutions" />
              <FooterLink text="API Documentation" />
              <FooterLink text="Pricing" />
              <FooterLink text="Security" />
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
            <div className="space-y-4">
              <FooterLink text="About Us" />
              <FooterLink text="Careers" />
              <FooterLink text="Blog" />
              <FooterLink text="Press Kit" />
              <FooterLink text="Contact" />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-12 border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {/* Social Media */}
          <motion.div>
            <h4 className="text-lg font-semibold mb-6 text-white">Join Our Community</h4>
            <div className="flex gap-4 mb-4">
              <SocialButton icon={<FaTwitter />} label="Twitter" />
              <SocialButton icon={<FaDiscord />} label="Discord" />
              <SocialButton icon={<FaTelegram />} label="Telegram" />
              <SocialButton icon={<FaGithub />} label="GitHub" />
            </div>
            <p className="text-sm text-gray-400">
              Stay updated with the latest Web3 payment innovations and community discussions.
            </p>
          </motion.div>

          {/* Legal Links */}
          <motion.div>
            <h4 className="text-lg font-semibold mb-6 text-white">Legal</h4>
            <div className="space-y-4">
              <FooterLink text="Privacy Policy" />
              <FooterLink text="Terms of Service" />
              <FooterLink text="Cookie Policy" />
              <FooterLink text="Compliance" />
            </div>
          </motion.div>

          {/* App Download */}
          <motion.div>
            <div className="flex items-start gap-4">
              <motion.div
                className="w-16 h-16 rounded-xl flex items-center justify-center border border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg grid grid-cols-6 gap-px p-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="rounded-sm bg-white/80"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: Math.random() > 0.5 ? 1 : 0.3 }}
                      transition={{ delay: i * 0.02, duration: 0.5 }}
                    />
                  ))}
                </div>
              </motion.div>
              <div>
                <h4 className="text-lg font-semibold mb-3 leading-tight text-white">
                  Your Web3 Wallet
                  <br />
                  Everywhere You Go
                </h4>
                <Button variant="link" className="p-0 h-auto text-purple-400 hover:text-purple-300 font-medium">
                  Download the App →
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-800 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm">
            © 2024 PayPact. All rights reserved. Built for the decentralized future.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

function Web3Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-600/10 border border-purple-600/20 text-xs text-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.2)]"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-xs">{icon}</span>
      <span>{text}</span>
    </motion.div>
  )
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer"
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-purple-400">{icon}</span>
      <span className="text-sm">{text}</span>
    </motion.div>
  )
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.button
      className="w-12 h-12 rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center text-gray-300 hover:text-purple-400 hover:border-purple-600/30 transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.2)] hover:shadow-[0_0_25px_rgba(147,51,234,0.4)]"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      {icon}
    </motion.button>
  )
}

function FooterLink({ text }: { text: string }) {
  return (
    <motion.button
      className="text-sm text-gray-300 hover:text-white transition-all duration-300 block text-left"
      whileHover={{ x: 5 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.button>
  )
}

export default ImprovedFooter
