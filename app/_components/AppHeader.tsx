"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import Image from "next/image";

function AppHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="p-4 shadow-sm flex items-center justify-between w-full bg-sidebarColor md:bg-white">
      <div className="hidden md:block">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-2  md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6 text-[#0e545b]" />
        </button>
        <motion.div
          className=""
          initial={{ opacity: 1 }}
          animate={{
            opacity: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: 1 },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            },
          }}
        >
          <Image
            src="/logo_new_left.png"
            alt="Coach Career Logo"
            width={120}
            height={30}
            className="w-10 h-auto"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default AppHeader;
