import { inngest } from "@/inngest/client";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { roadmapId, userInput } = await req.json();
    const user = await currentUser();

    const resultIds = await inngest.send({
      name: "AIRoadMapAgent",
      data: {
        userInput: userInput,
        roadmapId: roadmapId,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      },
    });

    const runID = resultIds?.ids[0];
    if (!runID) {
      return NextResponse.json({ error: "Failed to start Inngest run" }, { status: 500 });
    }

    let runstatus;

    // Poll Inngest run status
    while (true) {
      runstatus = await getRuns(runID);

      const status = runstatus?.data?.[0]?.status;
      if (status === "Completed" || status === "Cancelled") break;

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const output = runstatus?.data?.[0]?.output?.output?.[0];

    return NextResponse.json(output ?? { message: "Completed with no output" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
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
