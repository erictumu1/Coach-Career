"use client";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Report from "../_components/Report";

type AIReport = {
  user_name?: string;
};

function AIResumeAnalyzer() {
  const { recordid } = useParams();
  const [pdfUrl, setPdfUrl] = useState();
  const [aiReport, setAIReport] = useState<AIReport | null>(null);
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: (delay = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };
  useEffect(() => {
    recordid && getResumeAnalyzerRecord();
  }, [recordid]);

  const getResumeAnalyzerRecord = async () => {
    const result = await axios.get("/api/history?recordId=" + recordid);
    console.log(result.data);
    setPdfUrl(result.data?.metaData);
    setAIReport(result.data?.content);
  };

  // if (!pdfUrl) {
  //   return (
  //     <AnimatePresence>
  //       {!pdfUrl && (
  //         <motion.div
  //           className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
  //           variants={loaderVariants}
  //           initial="hidden"
  //           animate="visible"
  //           exit="exit"
  //         >
  //           <Loader2Icon
  //             style={{ width: 80, height: 80 }}
  //             className="text-customTeallight animate-spin mb-4"
  //           />
  //           <h2 className="text-xl bg-gradient-to-r from-customTealdark via-customTeallight to-[#197571] bg-clip-text text-transparent">
  //             Coach Career is analyzing your resume...
  //           </h2>
  //         </motion.div>
  //       )}
  //     </AnimatePresence>
  //   );
  // }

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp as any}>
      <div>
        <div className="grid lg:grid-cols-5 grid-cols-1 gap-y-10">
          {/* Resume Section */}
          <motion.div
            className="col-span-3"
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={slideInLeft as any}
          >
            <h2 className="font-bold text-2xl mb-5 text-customTeal">
              Resume Preview
              {aiReport?.user_name &&
                aiReport.user_name.toLowerCase() !== "user" && (
                  <>
                    <span className="text-black">
                      :{" "}
                      <span className="bouncy-underline">
                        {" "}
                        {aiReport?.user_name}
                      </span>
                    </span>
                  </>
                )}
            </h2>
            <iframe
              src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
              width={"90%"}
              className="min-w-lg border-none h-[500px] lg:h-[850px]"
              style={{ border: "none" }}
            />
          </motion.div>

          {/* Report Section */}
          <motion.div
            className="col-span-2"
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={slideInRight as any}
          >
            <Report aiReport={aiReport} />
          </motion.div>
        </div>

        <p className="text-[14px] text-customTealdark pt-4 text-center">
          &copy; {year} Created by{" "}
          <span className="text-customTealdark font-bold">Eric Tumu</span>. All
          Rights Reserved.
        </p>
      </div>
    </motion.div>
  );
}

export default AIResumeAnalyzer;
