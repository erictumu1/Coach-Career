"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { aiToolsList } from "@/constants/aiToolsList";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function History({ showDates = false }: { showDates?: boolean }) {
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    getHistory();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const getHistory = async () => {
    setLoading(true);
    try {
      const result = await axios.get("/api/history");

      const sortedHistory = result.data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setUserHistory(sortedHistory);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  const getAgentName = (path: string) => {
    if (!path) return undefined;
    return aiToolsList.find(
      (item) => item.path.trim().toLowerCase() === path.trim().toLowerCase()
    );
  };

  const getDisplayTitle = (history: any): string => {
    const agentType = getAgentName(history?.AIAgentType)?.name;
    const content = history?.content;

    switch (agentType) {
      case "AI Resume Analyzer":
        return content?.user_name ?? "AI Resume Analyzer";
      case "Career Roadmap Generator":
        return content?.roadmapTitle ?? "AI Roadmap";
      case "AI Career Q&A Chat":
        return content?.[0]?.content ?? "AI Agent Chat";
      case "Job Match Analyzer":
        return content?.job_title ?? "Job Match Analyzer";
      default:
        return agentType ?? "Unknown Tool";
    }
  };

  const groupHistoryByDate = (historyList: any[]) => {
    const groups: { [key: string]: any[] } = {};

    historyList.forEach((item) => {
      const date = new Date(item.createdAt);
      const key = date.toDateString();
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  };

  const getDateLabel = (dateStr: string): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const inputDate = new Date(dateStr);

    const isToday = inputDate.toDateString() === today.toDateString();
    const isYesterday = inputDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    const day = inputDate.getDate();
    const month = inputDate.toLocaleString("en-US", { month: "long" });
    const year = inputDate.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${day}${suffix} ${month} ${year}`;
  };

  const groupedHistory = groupHistoryByDate(userHistory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div>
        <div className="mt-7 p-5 bg-white-rounded border-2 rounded-xl border-customTeal">
          <h2 className="font-bold text-lg bouncy-underline">
            Previous History
          </h2>

          {loading && (
            <div>
              {[1, 2, 3].map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[50px] mt-4 w-full rounded-md"
                />
              ))}
            </div>
          )}

          {!loading && hasFetched && userHistory.length === 0 && (
            <div className="flex items-center justify-center flex-col mt-6">
              <Image src={"/bulb.png"} alt="bulb" width={50} height={50} />
              <h2>You don't have any history</h2>
              <Button className="mt-5 bg-customTeal hover:bg-customTealdark">
                Explore our AI Tools
              </Button>
            </div>
          )}

          {!loading && userHistory.length > 0 && (
            <div>
              {showDates
                ? Object.keys(groupedHistory)
                    .sort(
                      (a, b) => new Date(b).getTime() - new Date(a).getTime()
                    )
                    .map((dateKey) => (
                      <div key={dateKey} className="mt-6">
                        <h3 className="text-base font-semibold text-customTeal mb-2">
                          {getDateLabel(dateKey)}
                        </h3>

                        {groupedHistory[dateKey].map(
                          (history: any, index: number) => (
                            <motion.div
                              key={index}
                              custom={index}
                              initial="hidden"
                              animate="visible"
                              variants={fadeInUp as any}
                            >
                              <Link
                                key={index}
                                href={`/${history?.AIAgentType?.trim().replace(
                                  /^\/+/,
                                  ""
                                )}/${history?.recordId}`}
                                className="flex items-center justify-between gap-3 my-3 border p-3 shadow-lg rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <Image
                                    className="w-6 h-6 md:w-8 md:h-8 object-contain flex-shrink-0"
                                    src={
                                      getAgentName(history?.AIAgentType)
                                        ?.icon ?? "/bulb.png"
                                    }
                                    alt={
                                      getAgentName(history?.AIAgentType)
                                        ?.name ?? "/logo.png"
                                    }
                                    width={20}
                                    height={20}
                                  />
                                  <h2 className="text-customTealdark font-medium truncate max-w-[220px] sm:max-w-none">
                                    {getDisplayTitle(history)}
                                  </h2>
                                </div>
                              </Link>
                            </motion.div>
                          )
                        )}
                      </div>
                    ))
                : userHistory.slice(0, 3).map((history: any, index: number) => (
                    <motion.div
                      key={index}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUp as any}
                    >
                      <Link
                        href={`/${history?.AIAgentType?.trim().replace(
                          /^\/+/,
                          ""
                        )}/${history?.recordId}`}
                        className="flex items-center justify-between gap-3 my-3 border p-3 shadow-lg rounded-lg transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Image
                            className="w-6 h-6 md:w-8 md:h-8 object-contain flex-shrink-0"
                            src={
                              getAgentName(history?.AIAgentType)?.icon ??
                              "/bulb.png"
                            }
                            alt={
                              getAgentName(history?.AIAgentType)?.name ??
                              "/logo.png"
                            }
                            width={20}
                            height={20}
                          />
                          <h2 className="text-customTealdark font-medium truncate max-w-[220px] sm:max-w-none">
                            {getDisplayTitle(history)}
                          </h2>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
            </div>
          )}
        </div>
        <p className="text-[14px] text-customTealdark pt-6 -mb-9 md:pt-4 md:mb-0 text-center">
          &copy; {year} Created by{" "}
          <span className="text-customTealdark font-bold">Eric Tumu</span>. All
          Rights Reserved.
        </p>
      </div>
    </motion.div>
  );
}

export default History;
