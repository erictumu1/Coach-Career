import { TOOL } from "@/app/(routes)/dashboard/_components/AIToolCard";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useHandleToolClick = () => {
  const { user } = useUser();
  const router = useRouter();
  const [openResumeUpload, setOpenResumeUpload] = useState(false);
  const [openRoadmapDialog, setOpenRoadmapDialog] = useState(false);
  const [openJobDescriptionDialog, setOpenJobDescriptionDialog] =
    useState(false);

  const handleClick = async (tool: TOOL, checkHistory = true) => {
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      if (!userEmail) {
        console.error("User email not found");
        return;
      }

      // Check history only if checkHistory is true
      if (checkHistory) {
        const response = await axios.get("/api/history/check", {
          params: { path: tool.path },
        });

        const existing = response.data?.existing;
        console.log("Existing record:", existing);

        if (existing) {
          return router.push(`${tool.path}/${existing.recordId}`);
        }
      }

      // Handle tools that require dialogs before creating history
      if (tool.path === "/ai-tools/ai-resume-analyzer") {
        setOpenResumeUpload(true);
        return;
      }

      if (tool.path === "/ai-tools/ai-roadmap-agent") {
        setOpenRoadmapDialog(true);
        return;
      }

      if (tool.path === "/ai-tools/ai-job-match-analyzer") {
        setOpenJobDescriptionDialog(true);
        return;
      }

      // Creates a new record and redirect by defualt
      const id = uuidv4();
      await axios.post("/api/history", {
        recordId: id,
        content: [],
        AIAgentType: tool.path,
      });

      router.push(`${tool.path}/${id}`);
    } catch (error) {
      console.error("Tool click error:", error);
    }
  };

  return {
    handleClick,
    openResumeUpload,
    setOpenResumeUpload,
    openRoadmapDialog,
    setOpenRoadmapDialog,
    openJobDescriptionDialog,
    setOpenJobDescriptionDialog,
  };
};
