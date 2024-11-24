import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/authOptions";

const FAST_API_BASE_URL = process.env.FAST_API_BASE_URL;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!FAST_API_BASE_URL) {
    return NextResponse.json({ error: "FAST_API_BASE_URL is not set" }, { status: 500 });
  }

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, message, conversationId, audio_base64 } = body;

    if (action === "start") {
      const response = await fetch(`${FAST_API_BASE_URL}/start_conversation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          user_id: session.user.id,
        }),
      });

      const data = await response.json();
      return NextResponse.json(data);
    }

    if (action === "continue") {
      const params: Record<string, string> = {
        user_id: session.user.id,
        conversation_id: conversationId,
      };

      if (message) {
        params.message = message;
      }
      if (audio_base64) {
        params.audio_base64 = audio_base64;
        params.message = "";
      }

      const response = await fetch(`${FAST_API_BASE_URL}/continue_conversation/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(params),
      });

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const formattedMessages = conversation.messages
      .filter((msg) => msg.role !== "system")
      .map((msg) => ({
        type: msg.role === "assistant" ? "ai" : "user",
        content: msg.content,
        timestamp: msg.timestamp,
      }));

    return NextResponse.json({
      success: true,
      data: {
        messages: formattedMessages,
      },
    });
  } catch (error: any) {
    console.error("Error fetching conversation:", error?.message);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch conversation",
      },
      { status: 500 }
    );
  }
}
