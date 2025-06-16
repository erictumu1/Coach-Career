"use client";
import { Button } from "@/components/ui/button";
import { useHandleToolClick } from "@/hooks/useHandleToolClick";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import JobDescriptionDialog from "./JobDescriptionDialog";
import ResumeUploadDialog from "./ResumeUploadDialog";
import RoadmapGeneratorDialog from "./RoadmapGeneratorDialog";

export interface TOOL {
  name: string;
  desc: string;
  icon: string;
  button: string;
  path: string;
}

type AIToolProps = {
  tool: TOOL;
};

function AIToolCard({ tool }: AIToolProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleClick,
    openResumeUpload,
    setOpenResumeUpload,
    openRoadmapDialog,
    setOpenRoadmapDialog,
    openJobDescriptionDialog,
    setOpenJobDescriptionDialog,
  } = useHandleToolClick();

  const handleToolClick = async () => {
    if (tool.path === "/ai-tools/ai-chat") {
      setIsLoading(true);
      await handleClick(tool, false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      await handleClick(tool, false);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-lg border-customTeal shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <Image src={tool.icon} width={40} height={40} alt={tool.name} />
      <h2 className="font-bold text-customTealdark mt-2">{tool.name}</h2>
      <p className="font-medium text-gray-800">{tool.desc}</p>
      <Button
        className="w-full mt-3 bg-customTeal hover:bg-customTealdark"
        onClick={handleToolClick}
        disabled={isLoading}
      >
        {isLoading ? <Loader2Icon className="animate-spin" /> : tool.button}
      </Button>

      <ResumeUploadDialog
        openResumeUpload={openResumeUpload}
        setOpenResumeUpload={setOpenResumeUpload}
      />
      <RoadmapGeneratorDialog
        openDialog={openRoadmapDialog}
        setOpenDialog={() => setOpenRoadmapDialog(false)}
      />
      <JobDescriptionDialog
        openDialog={openJobDescriptionDialog}
        setOpenDialog={setOpenJobDescriptionDialog}
      />
    </div>
  );
}

export default AIToolCard;
