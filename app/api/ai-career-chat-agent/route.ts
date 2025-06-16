import { inngest } from "@/inngest/client";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  const { userInput } = await req.json();

  const resultIds = await inngest.send({
    name: "Coach Career",
    data: {
      userInput: userInput,
    },
  });
  const runID = resultIds?.ids[0];

  let runstatus;
  while (true) {
    runstatus = await getRuns(runID);
    if (runstatus?.data[0]?.status === "Completed") break;

    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return NextResponse.json(runstatus.data?.[0]?.output?.output[0]);
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
