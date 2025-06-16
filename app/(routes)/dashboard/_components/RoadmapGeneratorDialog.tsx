import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Loader2Icon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function RoadmapGeneratorDialog({ openDialog, setOpenDialog }: any) {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cancelled = useRef(false);
  const { has } = useAuth();

  useEffect(() => {
    if (openDialog) {
      cancelled.current = false;
    }
  }, [openDialog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const roadmapId = uuidv4();
    setLoading(true);

    try {
      //@ts-ignore
      // const hasSubscriptionEnabled = await has({ plan: "pro" });
      // if (!hasSubscriptionEnabled) {
      //   const resultHistory = await axios.get("/api/history");
      //   const historyList = resultHistory.data;
      //   const isPresent = await historyList.find(
      //     (item: any) => item?.aiAgentType == "/api/ai-roadmap-agent"
      //   );
      //   router.push("/billing");
      //   if (isPresent) {
      //     return null;
      //   }
      // }
      const result = await axios.post("/api/ai-roadmap-agent", {
        roadmapId,
        userInput,
      });

      if (cancelled.current) {
        console.log("Dialog was closed — operation cancelled.");
        return;
      }

      await router.push("/ai-tools/ai-roadmap-agent/" + roadmapId);

      setTimeout(() => {
        setOpenDialog(false);
        setLoading(false);
      }, 5000);
    } catch (e) {
      if (!cancelled.current) console.error(e);
      setLoading(false);
    }
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
      >
        <DialogHeader>
          <DialogTitle className="text-customTealdark">
            Enter your desired career.
          </DialogTitle>
          <DialogDescription>
            Describe your goal (e.g. "Front End Developer")
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Input
            placeholder="e.g; Front End Developer"
            className="text-customTealdark mt-3"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            required
          />

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={loading || !userInput.trim()}
              className="bg-customTeal hover:bg-customTealdark"
            >
              {loading ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : (
                <Sparkles className="mr-2" />
              )}
              Generate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RoadmapGeneratorDialog;
