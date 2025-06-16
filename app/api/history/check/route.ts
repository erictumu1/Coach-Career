import { db } from "@/configs/db";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { userHistoryTable } from "../../../../configs/schema";

export async function GET(req: Request) {
  try {
    const user = await currentUser();
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!user || !path) {
      console.log("Missing user or path:", { user, path });
      return NextResponse.json(
        { error: "Missing user or path" },
        { status: 400 }
      );
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;

    const history = await db
      .select()
      .from(userHistoryTable)
      .where(
        and(
          eq(userHistoryTable.userEmail, userEmail!),
          or(
            eq(userHistoryTable.AIAgentType, path.trim()),
            eq(userHistoryTable.AIAgentType, ` ${path.trim()}`)
          )
        )
      )
      .orderBy(desc(userHistoryTable.createdAt));

    console.log("Full history for", path, "=>", history);

    // Finds the first record with non empty content
    const validEntry = history.find(entry => 
      Array.isArray(entry.content) ? entry.content.length > 0 : !!entry.content
    );

    return NextResponse.json({ existing: validEntry ?? null });

  } catch (e) {
    console.error("Error fetching user history:", e);
    return NextResponse.json(
      { error: "Failed to fetch user history" },
      { status: 500 }
    );
  }
}
