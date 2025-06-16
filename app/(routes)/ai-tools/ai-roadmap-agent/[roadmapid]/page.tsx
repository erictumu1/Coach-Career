"use client";
import RoadmapGeneratorDialog from "@/app/(routes)/dashboard/_components/RoadmapGeneratorDialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Roadmapcanvas from "../_components/Roadmapcanvas";

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

function RoadmapGeneratorAgent() {
  const params = useParams();
  const roadmapid = params.roadmapid as string;
  const [roadMapDetail, setRoadMapDetail] = useState<any>(null);
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);
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
    if (roadmapid) {
      getRoadmapDetails();
    }
  }, [roadmapid]);

  const getRoadmapDetails = async () => {
    try {
      const result = await axios.get("/api/history?recordId=" + roadmapid);
      console.log("Fetched Data:", result.data);
      setRoadMapDetail(result.data?.content);
    } catch (error) {
      console.error("Error fetching roadmap details", error);
    }
  };

  // if (!roadMapDetail) {
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
  //           Coach Career is preparing your career road map...
  //         </h2>
  //       </motion.div>
  //     </AnimatePresence>
  //   );
  // }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-5">
        {/* Left section - Slide in from left */}
        <motion.div
          className="w-fit p-4 rounded-lg border-2 border-customTeal shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
          initial="hidden"
          animate="visible"
          variants={slideInLeft as any}
        >
          <h2 className="font-bold text-2xl col-span-3 text-customTealdark">
            {roadMapDetail?.roadmapTitle}.
          </h2>
          <p className="mt-3 text-customTealdark">
            <strong className="bouncy-underline">Description:</strong> <br />
            <br />
            {roadMapDetail?.description}
          </p>
          <h2 className="mt-5 font-medium text-customTealdark">
            <strong className="text-black">Duration:</strong>{" "}
            {roadMapDetail?.duration}
          </h2>
          <Button
            onClick={() => setOpenRoadmapDialog(true)}
            className="mt-5 bg-customTeal hover:bg-customTealdark text-white"
          >
            Create New Roadmap
          </Button>
        </motion.div>

        {/* Right section - Slide in from right */}
        <motion.div
          className="md:col-span-2 w-full h-[80vh]"
          initial="hidden"
          animate="visible"
          variants={slideInRight as any}
        >
          <Roadmapcanvas
            initialNodes={roadMapDetail?.initialNodes}
            nodes={roadMapDetail?.nodes}
            edges={roadMapDetail?.edges}
            edges2={roadMapDetail?.edges2}
          />
        </motion.div>
      </div>

      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={() => setOpenRoadmapDialog(false)}
      />

      <p className="text-[14px] text-customTealdark pt-4 text-center">
        &copy; {year} Created by{" "}
        <span className="text-customTealdark font-bold">Eric Tumu</span>. All
        Rights Reserved.
      </p>
    </div>
  );
}

export default RoadmapGeneratorAgent;
