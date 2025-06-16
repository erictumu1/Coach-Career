"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import JobMatchReport from "../_components/Report";

type AIReport = {
  user_name?: string;
};

function JobMatchAnalyzer() {
  const { jobmatchid } = useParams();
  const [aiReport, setAIReport] = useState(null);
  const year = new Date().getFullYear();

  const loaderVariants = {
    hidden: { opacity: 0, x: "-100vw" },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: "100vw",
      transition: { duration: 0.5, ease: "easeIn" },
    },
  };

  useEffect(() => {
    console.log("useEffect triggered with recordid:", jobmatchid);
    if (!jobmatchid) return;
    const fetchData = async () => {
      const res = await axios.get("/api/history?recordId=" + jobmatchid);
      console.log("AI report:", res.data?.content);
      setAIReport(res.data?.content);
    };
    fetchData();
  }, [jobmatchid]);

  // if (!aiReport) {
  //   return (
  //     <AnimatePresence>
  //       <motion.div
  //         className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
  //         variants={loaderVariants}
  //         initial="hidden"
  //         animate="visible"
  //         exit="exit"
  //       >
  //         <Loader2Icon
  //           style={{ width: 80, height: 80 }}
  //           className="text-customTeallight animate-spin mb-4"
  //         />
  //         <h2 className="text-xl bg-gradient-to-r from-customTealdark via-customTeallight to-[#197571] bg-clip-text text-transparent">
  //           Coach Career is assessing your job compatability...
  //         </h2>
  //       </motion.div>
  //     </AnimatePresence>
  //   );
  // }

  return (
    <div className="gap-y-10">
      <div className="col-span-2">
        <JobMatchReport matchReport={aiReport} />
        <p className="text-[14px] text-customTealdark pt-6 -mb-9 md:pt-4 md:mb-0 text-center">
          &copy; {year} Created by{" "}
          <span className="text-customTealdark font-bold">Eric Tumu</span>. All
          Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default JobMatchAnalyzer;
