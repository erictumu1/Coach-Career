"use client";

import { motion } from "framer-motion";
import AITools from "./_components/AITools";
import History from "./_components/History";
import WelcomeBanner from "./_components/WelcomeBanner";

function Dashboard() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="space-y-12">
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        layout="position"
        variants={fadeInUp as any}
      >
        <WelcomeBanner />
      </motion.div>

      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        layout="position"
        variants={fadeInUp as any}
      >
        <AITools />
      </motion.div>

      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        layout="position"
        variants={fadeInUp as any}
      >
        <History />
      </motion.div>
    </div>
  );
}

export default Dashboard;
