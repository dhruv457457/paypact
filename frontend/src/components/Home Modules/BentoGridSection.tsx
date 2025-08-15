"use client";

import { cn } from "../../lib/utils";
import { BentoGrid, BentoGridItem } from "../UI/bento-grid";
import {
  FaUsers,
  FaChartLine,
  FaPlusCircle,
  FaQrcode,
  FaUserCheck,
  FaClipboardList,
  FaGoogle,
} from "react-icons/fa";
import { SiSolana } from "react-icons/si";
import { motion } from "framer-motion";

export function BentoGridSection() {
  return (
    <section className="py-20 px-8 relative overflow-hidden bg-black">
    
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}{" "}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
      
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the powerful features that make PayPact the ultimate tool
            for seamless, transparent, and automated group payments on Solana.{" "}
          </p>{" "}
        </motion.div>{" "}
        <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
          {" "}
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              {" "}
              <BentoGridItem
                title={item.title}
                description={item.description}
                header={item.header}
                className={cn(
                  item.className
                )}
                icon={item.icon}
              />{" "}
            </motion.div>
          ))}{" "}
        </BentoGrid>{" "}
      </div>{" "}
    </section>
  );
}

const PactCreationDemo = () => {
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] flex-col space-y-3 p-4 justify-center"
    >
      {" "}
      <motion.div
        variants={{
          initial: { x: 0, opacity: 0.7 },
          animate: { x: 10, opacity: 1 },
        }}
        className="flex flex-row rounded-md border border-[#1C1C1E] p-2 items-center space-x-2 bg-gray-900/50"
      >
        <div className="text-xs text-gray-400 w-20">Pact Name:</div>
        <div className="flex-1 bg-gray-700 h-2 rounded-full" />{" "}
      </motion.div>{" "}
      <motion.div
        variants={{
          initial: { x: 0, opacity: 0.7 },
          animate: { x: -10, opacity: 1 },
        }}
        className="flex flex-row rounded-md border border-[#1C1C1E] p-2 items-center space-x-2 bg-gray-900/50"
      >
        <div className="text-xs text-gray-400 w-20">Amount:</div>
        <div className="flex-1 bg-gray-700 h-2 rounded-full w-1/2" />{" "}
      </motion.div>{" "}
      <motion.div
        variants={{
          initial: { x: 0, opacity: 0.7 },
          animate: { x: 10, opacity: 1 },
        }}
        className="flex flex-row rounded-md border border-[#1C1C1E] p-2 items-center space-x-2 bg-gray-900/50"
      >
        <div className="text-xs text-gray-400 w-20">Participants:</div>
        <div className="flex-1 bg-gray-700 h-2 rounded-full" />{" "}
      </motion.div>{" "}
    </motion.div>
  );
};

const QrPaymentDemo = () => {
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem]  flex-col justify-center items-center p-4">
      {" "}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {" "}
        <FaQrcode className="text-6xl text-purple-400 drop-shadow-[0_0_15px_rgba(147,51,234,0.6)]" />{" "}
      </motion.div>{" "}
      <div className="text-xs text-gray-300 mt-3 font-semibold">
        Scan with Solana Pay
      </div>{" "}
    </motion.div>
  );
};

const OnboardingDemo = () => {
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] flex-col justify-center items-center p-4 space-y-4">
      {" "}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <FaGoogle className="text-4xl text-gray-400" />{" "}
      </motion.div>{" "}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "2rem" }}
        className="w-px bg-gray-600"
      />{" "}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <SiSolana className="text-4xl text-green-400" />{" "}
      </motion.div>{" "}
    </motion.div>
  );
};

const AutomatedTrackingDemo = () => {
  const participants = ["Alex", "Sarah", "Taylor"];
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] flex-col p-4 justify-center space-y-2">
      {" "}
      {participants.map((name, i) => (
        <motion.div
          key={name}
          className="flex justify-between items-center bg-gray-900/50 p-2 rounded-md border border-gray-700/50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
        >
          <span className="text-sm text-gray-300">{name}</span>{" "}
          <motion.div
            className={`w-4 h-4 rounded-full ${
              i < 2 ? "bg-green-500" : "bg-red-500"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2 + 0.5 }}
          />{" "}
        </motion.div>
      ))}{" "}
    </motion.div>
  );
};

const OrganizerDashboardDemo = () => {
  const progress = 66;
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] flex-col p-4 justify-center items-center">
      {" "}
      <div className="text-sm font-semibold text-white mb-2">
        Pact Progress
      </div>{" "}
      <div className="w-full bg-gray-800 rounded-full h-4 border border-gray-700">
        {" "}
        <motion.div
          className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />{" "}
      </div>{" "}
      <div className="text-xs text-gray-300 mt-2">{progress}% Collected</div>{" "}
    </motion.div>
  );
};

const SolanaPoweredDemo = () => {
  return (
    <motion.div className="flex flex-1 w-full h-full min-h-[6rem] rounded-lg flex-col justify-center items-center p-4">
      {" "}
      <motion.div
        animate={{
          y: [0, -5, 0],
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {" "}
        <SiSolana className="text-7xl text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]" />{" "}
      </motion.div>{" "}
      <div className="text-sm text-gray-300 mt-4 font-semibold">
        Powered by Solana
      </div>{" "}
      <div className="text-xs text-gray-500">Fast, Secure, and Low-Cost</div>{" "}
    </motion.div>
  );
};

const items = [
  {
    title: "Instant Pact Creation",
    description:
      "Define payment terms and invite participants in seconds. No more manual coordination.",
    header: <PactCreationDemo />,
    className: "md:col-span-2 ",
    icon: <FaPlusCircle className="h-4 w-4 " />,
  },
  {
    title: "QR Code Payments",
    description:
      "Participants pay effortlessly using a unique Solana Pay QR code from their mobile wallet.",
    header: <QrPaymentDemo />,
    className: "md:col-span-1",
    icon: <FaQrcode className="h-4 w-4 " />,
  },
  {
    title: "Frictionless Onboarding",
    description:
      "Users create a self-custody wallet with a social login, powered by Web3Auth.",
    header: <OnboardingDemo />,
    className: "md:col-span-1",
    icon: <FaUserCheck className="h-4 w-4 " />,
  },
  {
    title: "Automated Tracking",
    description:
      "Payments are verified on-chain and statuses update in real-time. No manual check-ins needed.",
    header: <AutomatedTrackingDemo />,
    className: "md:col-span-1",
    icon: <FaClipboardList className="h-4 w-4 " />,
  },
  {
    title: "Organizer Dashboard",
    description:
      "Get a clear overview of who has paid and track the total amount collected in real-time.",
    header: <OrganizerDashboardDemo />,
    className: "md:col-span-1",
    icon: <FaChartLine className="h-4 w-4 " />,
  },
  {
    title: "Powered by Solana",
    description:
      "Leverage near-instant, low-cost transactions for a seamless payment experience for everyone.",
    header: <SolanaPoweredDemo />,
    className: "md:col-span-3",
    icon: <SiSolana className="h-4 w-4 " />,
  },
];
