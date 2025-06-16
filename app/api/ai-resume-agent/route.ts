import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import zlib from "zlib";

//Add these two lines to make the app work well with vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

export const runtime = "nodejs";

function safeJson(obj: any) {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (typeof value === 'undefined') return null;
    if (typeof value === 'bigint') return value.toString();
    if (value instanceof Buffer) return "<Buffer>";
    if (typeof value === 'function' || typeof value === 'symbol') return undefined;
    if (value?.constructor?.name && value.constructor.name !== 'Object' && value.constructor.name !== 'Array') {
      return `[${value.constructor.name}]`;
    }
    return value;
  }));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile: any = formData.get("resumeFile");
    const recordId = formData.get("recordId");

    if (!resumeFile) {
      console.error("Missing resumeFile");
      return NextResponse.json({ error: "Missing resumeFile" }, { status: 400 });
    }

    const user = await currentUser();
    console.log("Current user:", user?.primaryEmailAddress?.emailAddress);

    // Log file info
    console.log("Resume file size:", resumeFile.size);
    console.log("Resume file type:", resumeFile.type);

    const arrayBuffer = await resumeFile.arrayBuffer();
    console.log("Successfully read arrayBuffer");

    let fullPdfText = "";
    try {
      const loader = new WebPDFLoader(resumeFile);
      const docs = await loader.load();
      fullPdfText = docs.map(doc => doc.pageContent).join("\n");
      console.log("PDF text extracted");
    } catch (e) {
      console.error("PDF loading failed", e);
      return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
    }

    // Compress the text using gzip and encode as base64
    let compressedTextBase64 = "";
    try {
      const compressedBuffer = zlib.gzipSync(fullPdfText);
      compressedTextBase64 = compressedBuffer.toString("base64");
      console.log("PDF text compressed, original size:", fullPdfText.length, "compressed size:", compressedBuffer.length);
    } catch (e) {
      console.error("Compression failed", e);
      return NextResponse.json({ error: "Compression failed" }, { status: 500 });
    }

    // Send compressed text to inngest (exclude large base64 file!)
    let resultIds;
    try {
      resultIds = await inngest.send({
        name: "AiResumeAgent",
        data: {
          recordId,
          compressedPdfText: compressedTextBase64,
          AIAgentType: "/ai-tools/ai-resume-analyzer",
          userEmail: user?.primaryEmailAddress?.emailAddress,
        },
      });
      console.log("Inngest triggered:", resultIds);
    } catch (e) {
      console.error("Inngest send failed", e);
      return NextResponse.json({ error: "Inngest send failed" }, { status: 500 });
    }

    const runID = resultIds?.ids[0];
    if (!runID) {
      console.error("Missing runID");
      return NextResponse.json({ error: "Failed to trigger AI agent" }, { status: 500 });
    }

    let runstatus;
    try {
      while (true) {
        runstatus = await getRuns(runID);
        if (runstatus?.data[0]?.status === "Completed") break;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      console.log("Run completed");
    } catch (e) {
      console.error("Fetching run status failed", e);
      return NextResponse.json({ error: "Run status polling failed" }, { status: 500 });
    }

    const finalOutput = runstatus.data?.[0]?.output?.output[0];
    console.log("Final Output:", finalOutput);

    return NextResponse.json(safeJson(finalOutput));
  } catch (err) {
    console.error("Unhandled error in POST handler:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function getRuns(runId: string) {
  try {
    console.log("Getting run status for runId:", runId);
    const result = await axios.get(
      `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
      {
        headers: {
          Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
        },
      }
    );
    return result.data;
  } catch (e) {
    console.error("getRuns failed:", e);
    throw e;
  }
}

