import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

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
  const formData = await req.formData();
  const resumeFile: any = formData.get("resumeFile");
  const recordId = formData.get("recordId");

  const user = await currentUser();

  if (!resumeFile) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }


  const loader = new WebPDFLoader(resumeFile);
  const docs = await loader.load();
  const fullPdfText = docs.map(doc => doc.pageContent).join("\n");

  const arrayBuffer = await resumeFile.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const resultIds = await inngest.send({
    name: "AiResumeAgent",
    data: {
      recordId,
      resumeFile,
      base64ResumeFile: base64,
      pdfText: fullPdfText,
      AIAgentType: "/ai-tools/ai-resume-analyzer",
      userEmail: user?.primaryEmailAddress?.emailAddress,
    },
  });

  const runID = resultIds?.ids[0];
  if (!runID) {
    return NextResponse.json({ error: "Failed to trigger AI agent." }, { status: 500 });
  }

  let runstatus;
  while (true) {
    runstatus = await getRuns(runID);
    if (runstatus?.data[0]?.status === "Completed") break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const finalOutput = runstatus.data?.[0]?.output?.output[0];
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
