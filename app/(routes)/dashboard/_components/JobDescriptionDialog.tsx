import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { File, Loader2Icon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function JobDescriptionDialog({ openDialog, setOpenDialog }: any) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescInput, setJobDescInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cancelled = useRef(false);
  const { has } = useAuth();

  useEffect(() => {
    if (openDialog) {
      cancelled.current = false;
    }
  }, [openDialog]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        openDialog &&
        resumeFile &&
        jobDescInput.trim() &&
        !loading
      ) {
        e.preventDefault();
        submitJobMatch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openDialog, resumeFile, jobDescInput, loading]);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const submitJobMatch = async () => {
    if (!resumeFile || !jobDescInput.trim()) return;

    const recordId = uuidv4();
    setLoading(true);

    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("recordId", recordId);
    formData.append("jobDescription", jobDescInput);

    try {
      //@ts-ignore
      // const hasSubscriptionEnabled = await has({ plan: "pro" });
      // if (!hasSubscriptionEnabled) {
      //   const resultHistory = await axios.get("/api/history");
      //   const historyList = resultHistory.data;
      //   const isPresent = await historyList.find(
      //     (item: any) => item?.aiAgentType == "/api/ai-job-match-agent"
      //   );
      //   router.push("/billing");
      //   if (isPresent) {
      //     return null;
      //   }
      // }
      const result = await axios.post("/api/ai-job-match-agent", formData);

      if (cancelled.current) return;

      await router.push("/ai-tools/ai-job-match-analyzer/" + recordId);
      setTimeout(() => {
        setOpenDialog(false);
        setLoading(false);
      }, 5000);
    } catch (e) {
      if (!cancelled.current) console.error("Upload error:", e);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitJobMatch();
  };

  const handleClose = () => {
    cancelled.current = true;
    setLoading(false);
    setOpenDialog(false);
  };

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        if (!open && !loading) {
          handleClose();
        } else {
          setOpenDialog(open);
        }
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="custom-dialog"
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-customTealdark">
              Upload Resume & Paste Job Description
            </DialogTitle>
            <DialogDescription>
              This tool will analyze how well your resume matches the job.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <label
              htmlFor="resumeUpload"
              className="mt-1 flex items-center justify-center p-7 border border-dashed rounded-2x hover:bg-sidebarColor cursor-pointer"
            >
              {resumeFile ? (
                <div className="flex items-center mt-3 text-customTealdark font-bold">
                  <img
                    src={"/pdf.png"}
                    width="65"
                    height="65"
                    alt="PDF icon"
                    className="mr-2"
                  />
                  <h2>{resumeFile?.name}</h2>
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

          <div className="mt-4">
            <label className="text-sm font-semibold text-customTealdark mb-1 block">
              Job Description
            </label>
            <Textarea
              className="text-customTealdark"
              rows={6}
              value={jobDescInput}
              onChange={(e) => setJobDescInput(e.target.value)}
              placeholder="Paste the job description here..."
              required
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={loading || !resumeFile || !jobDescInput.trim()}
              className="bg-customTeal hover:bg-customTealdark"
            >
              {loading ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : (
                <Sparkles className="mr-2" />
              )}
              Assess Match
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default JobDescriptionDialog;
