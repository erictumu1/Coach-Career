import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import zlib from "zlib";

// Add these two lines to make the app work well with vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

export const runtime = "nodejs";

function safeJson(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "undefined") return null;
      if (typeof value === "bigint") return value.toString();
      if (value instanceof Buffer) return "<Buffer>";
      if (typeof value === "function" || typeof value === "symbol")
        return undefined;
      if (
        value?.constructor?.name &&
        value.constructor.name !== "Object" &&
        value.constructor.name !== "Array"
      ) {
        return `[${value.constructor.name}]`;
      }
      return value;
    })
  );
}

export async function POST(req: NextRequest) {
  const FormData = await req.formData();
  const resumeFile: any = FormData.get("resumeFile");
  const recordId = FormData.get("recordId");
  const jobDescription = FormData.get("jobDescription");
  const user = await currentUser();

  if (!resumeFile || !recordId || !jobDescription) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  const loader = new WebPDFLoader(resumeFile);
  const docs = await loader.load();
  const fullPdfText = docs.map((doc) => doc.pageContent).join("\n");

  console.log("Full Resume Text:", fullPdfText.slice(0, 500)); // print a preview

  // ✅ Compress extracted PDF text
  let compressedPdfText;
  try {
    const compressedBuffer = zlib.gzipSync(fullPdfText);
    compressedPdfText = compressedBuffer.toString("base64");
    console.log(
      "Compressed PDF text size:",
      compressedBuffer.length,
      "Original size:",
      fullPdfText.length
    );
  } catch (error) {
    console.error("Compression failed:", error);
    return NextResponse.json(
      { error: "Failed to compress resume text." },
      { status: 500 }
    );
  }

  // 🚫 No need to send raw file or base64 due to Inngest payload limits
  const resultIds = await inngest.send({
    name: "AIJobMatchAgent",
    data: {
      recordId,
      compressedPdfText, // ✅ compressed text
      jobDescription,
      AIAgentType: "/ai-tools/ai-job-match-analyzer",
      userEmail: user?.primaryEmailAddress?.emailAddress,
    },
  });

  const runID = resultIds?.ids[0];
  if (!runID) {
    return NextResponse.json(
      { error: "Failed to start job match agent." },
      { status: 500 }
    );
  }

  let runstatus;
  while (true) {
    runstatus = await getRuns(runID);
    if (runstatus?.data[0]?.status === "Completed") break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const finalOutput = runstatus.data?.[0]?.output;
  console.log("Final Output:", finalOutput);

  return NextResponse.json(safeJson(finalOutput));
}

async function getRuns(runId: string) {
  const result = await axios.get(
    `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );

  return result.data;
}
