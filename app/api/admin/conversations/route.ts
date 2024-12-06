import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/authOptions";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";

    let dateFilter = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (filter) {
      case "today":
        dateFilter = {
          createdAt: {
            gte: today,
          },
        };
        break;
      case "yesterday":
        dateFilter = {
          createdAt: {
            gte: yesterday,
            lt: today,
          },
        };
        break;
      case "last7days":
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        dateFilter = {
          createdAt: {
            gte: last7Days,
          },
        };
        break;
      case "last30days":
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        dateFilter = {
          createdAt: {
            gte: last30Days,
          },
        };
        break;
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        ...dateFilter,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const filteredConversations = conversations
      .map((conv) => ({
        ...conv,
        messages: conv.messages.filter((msg) => msg.role !== "system"),
        messageCount: conv.messages.filter((msg) => msg.role !== "system").length,
      }))
      .filter((conv) => conv.messageCount > 0);

    return NextResponse.json({
      success: true,
      conversations: filteredConversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    await prisma.conversation.update({
      where: {
        id: id,
      },
      data: {
        status: "deleted",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Conversation ID and status are required" },
        { status: 400 }
      );
    }

    if (!["active", "archived", "deleted"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const conversation = await prisma.conversation.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return NextResponse.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update conversation" },
      { status: 500 }
    );
  }
}
