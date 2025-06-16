import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { File, Loader2Icon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function ResumeUploadDialog({ openResumeUpload, setOpenResumeUpload }: any) {
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cancelled = useRef(false);
  const { has } = useAuth();

  useEffect(() => {
    if (openResumeUpload) {
      cancelled.current = false;
    }
  }, [openResumeUpload]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && openResumeUpload && file && !loading) {
        e.preventDefault();
        submitResume();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openResumeUpload, file, loading]);

  const onFileChange = (event: any) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const submitResume = async () => {
    if (!file) return;

    setLoading(true);
    const recordId = uuidv4();
    const formData = new FormData();
    formData.append("recordId", recordId);
    formData.append("resumeFile", file);

    //@ts-ignore
    // const hasSubscriptionEnabled = await has({ plan: "pro" });
    // if (!hasSubscriptionEnabled) {
    //   const resultHistory = await axios.get("/api/history");
    //   const historyList = resultHistory.data;

    //   const isPresent = historyList.find(
    //     (item: any) => item?.aiAgentType == "/api/ai-resume-agent"
    //   );
    //   if (isPresent) {
    //     router.push("/billing");
    //     return;
    //   }
    // }

    try {
      const result = await axios.post("/api/ai-resume-agent", formData);

      if (cancelled.current) return;

      await router.push("/ai-tools/ai-resume-analyzer/" + recordId);
      setTimeout(() => {
        setOpenResumeUpload(false);
        setLoading(false);
      }, 5000);
    } catch (e) {
      if (!cancelled.current) console.error("Upload error:", e);
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitResume();
  };

  const handleClose = () => {
    cancelled.current = true;
    setLoading(false);
    setOpenResumeUpload(false);
  };

  return (
    <Dialog
      open={openResumeUpload}
      onOpenChange={(open) => {
        if (!open && !loading) {
          handleClose();
        }
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="custom-dialog"
      >
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-customTealdark">
              Upload your Resume
            </DialogTitle>

            <DialogDescription>
              <div>
                <label
                  htmlFor="resumeUpload"
                  className="mt-1 flex items-center justify-center p-7 border border-dashed rounded-2x hover:bg-sidebarColor cursor-pointer"
                >
                  {file ? (
                    <div className="flex items-center mt-3 text-customTealdark font-bold">
                      <img
                        src={"/pdf.png"}
                        width="65"
                        height="65"
                        alt="PDF icon"
                        className="mr-2"
                      />
                      <h2>{file?.name}</h2>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 mt-3 text-black">
                      <File className="h-10 w-10" />
                      <h2>Click here to Upload PDF file</h2>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  id="resumeUpload"
                  accept="application/pdf"
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={!file || loading}
              className="bg-sidebarButtonColor hover:bg-customTealdark"
            >
              {loading ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : (
                <Sparkles className="mr-2" />
              )}
              Upload & Analyze
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ResumeUploadDialog;
