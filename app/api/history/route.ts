import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../configs/db";
import { userHistoryTable } from "../../../configs/schema";

export async function POST(req: Request) {
  const { content, recordId, AIAgentType } = await req.json();
  const user = await currentUser();

  try {
    const result = await db.insert(userHistoryTable).values({
      recordId,
      content,
      userEmail: user?.primaryEmailAddress?.emailAddress,

      AIAgentType: AIAgentType?.trim(),
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("POST /api/history error:", e);
    return NextResponse.json(
      { error: "Failed to create history" },
      { status: 500 }
    );
  }
}

export async function PUT(req: any) {
  const { content, recordId } = await req.json();

  try {
    // Try updating first
    const updateResult = await db
      .update(userHistoryTable)
      .set({
        content: content,
      })
      .where(eq(userHistoryTable.recordId, recordId));

    if (updateResult.rowCount === 0) {
      // No rows updated, then insert new record
      const user = await currentUser();
      const insertResult = await db.insert(userHistoryTable).values({
        recordId: recordId,
        content: content,
      });
      return NextResponse.json(insertResult);
    }

    // Return update result if successful
    return NextResponse.json(updateResult);
  } catch (e) {
    return NextResponse.json(e);
  }
}

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const recordId = searchParams.get("recordId");
  const user = await currentUser();

  try {
    if (recordId) {
      const result = await db
        .select()
        .from(userHistoryTable)
        .where(eq(userHistoryTable.recordId, recordId));

      const cleaned = JSON.parse(JSON.stringify(result[0]));
      return NextResponse.json(cleaned);
    } else {
      if (!user || !user.primaryEmailAddress?.emailAddress) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const result = await db
        .select()
        .from(userHistoryTable)
        .where(
          and(
            eq(
              userHistoryTable.userEmail,
              user.primaryEmailAddress.emailAddress
            ),
            isNotNull(userHistoryTable.AIAgentType),
            isNotNull(userHistoryTable.content),
            sql`content::text != '[]'`
          )
        )
        .orderBy(desc(userHistoryTable.id));

      return NextResponse.json(result);
    }
  } catch (e) {
    console.error("GET /api/history error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
