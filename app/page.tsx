"use client";
import CarAnimation from "@/components/CarAnimation";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const year = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStartedClick = () => {
    if (!isLoaded) return;
    if (user) {
      setIsLoading(true);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full bg-sidebarColor border-b border-gray-200 text-sm z-50">
        <nav
          className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between py-3"
          aria-label="Global"
        >
          <div className="flex items-center">
            <div className="flex justify-center items-center gap-1">
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
                  alt="logo left"
                  width={60}
                  height={20}
                />
              </motion.div>
              <Image
                src="/logo_new_right.png"
                alt="logo right"
                width={110}
                height={40}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            {!user ? (
              <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                <div className="flex items-center gap-x-2 font-medium text-customTeal hover:text-customTealdark hover:cursor-pointer">
                  Sign In
                </div>
              </SignInButton>
            ) : (
              <UserButton />
            )}
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <div className="mt-10 max-w-6xl mx-auto px-4 -py-10 md:-mt-10 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex-1">
            <motion.h1
              className="font-bold text-5xl md:text-7xl text-customTeal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="text-black">Coach</span> Career
            </motion.h1>

            <motion.h2
              className="font-bold text-2xl sm:text-3xl mt-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Ready to land your dream Job?
            </motion.h2>

            <motion.p
              className="mt-6 text-gray-700 text-base sm:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="text-customTeal font-bold">Coach Career </span>
              is here to provide{" "}
              <span className="text-customTeal font-bold">
                Career Q&A Chat Sessions
              </span>
              ,{" "}
              <span className="text-customTeal font-bold">Resume Analysis</span>
              ,{" "}
              <span className="text-customTeal font-bold">Career RoadMaps</span>{" "}
              and{" "}
              <span className="text-customTeal font-bold">
                Job Match Analysis
              </span>{" "}
              to help you prepare for the work market.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-10 flex justify-center md:justify-start"
            >
              {!user ? (
                <SignInButton mode="modal" signUpForceRedirectUrl="/dashboard">
                  <Button className="bg-customTeal text-white px-6 py-3 rounded-md hover:bg-white hover:text-black hover:border-2 hover:border-customTeal transition cursor-pointer">
                    Get Started
                  </Button>
                </SignInButton>
              ) : (
                <Button
                  onClick={handleGetStartedClick}
                  disabled={isLoading}
                  className="bg-customTeal text-white px-6 py-3 rounded-md hover:bg-white hover:text-black hover:border-2 hover:border-customTeal transition cursor-pointer flex items-center gap-2"
                >
                  {isLoading && <Loader2Icon className="animate-spin" />}
                  {isLoading ? "Redirecting..." : "Get Started"}
                </Button>
              )}
            </motion.div>
          </div>

          <Script
            src="https://unpkg.com/@splinetool/viewer@1.10.7/build/spline-viewer.js"
            type="module"
            strategy="afterInteractive"
          />
          <motion.div
            className="hidden md:flex flex-1 h-[400px] md:h-[800px] w-[800px] -mt-20 relative"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 1, delay: 1 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
            }}
          >
            {/* @ts-ignore */}
            <spline-viewer url="https://prod.spline.design/as3B8PtcUGR8sITK/scene.splinecode" />
            <Image
              src="/blankwhite.png"
              alt="Bul"
              width={150}
              height={150}
              className="absolute z-10 top-[670px] left-[240px] "
            />
            <Image
              src="/blankwhite.png"
              alt="Bul"
              width={150}
              height={150}
              className="absolute z-10 top-[670px] left-[370px]"
            />
            <Image
              src="/blankwhite.png"
              alt="Bul"
              width={150}
              height={150}
              className="absolute z-10 top-[670px] left-[180px]"
            />
          </motion.div>
          <motion.div
            className="md:hidden relative"
            //   initial={{ opacity: 0 }}
            //   animate={{
            //     opacity: 1,
            //     y: [0, -10, 0],
            //   }}
            //   transition={{
            //     opacity: { duration: 1, delay: 1 },
            //     y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
            //   }}
          >
            <CarAnimation />
          </motion.div>
        </div>
      </main>
      <footer className="text-sm text-center py-6 border-t mt-4 md:text-m text-gray-600">
        &copy; {year} Created by{" "}
        <span className="text-customTeal font-bold">Eric Tumu</span>. All Rights
        Reserved.
      </footer>
    </div>
  );
}
