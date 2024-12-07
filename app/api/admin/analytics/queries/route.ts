import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalConversations = await prisma.conversation.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const activeConversations = await prisma.conversation.count({
      where: {
        status: "active",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const conversationsWithFirstMessage = await prisma.conversation.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const messageGroups = conversationsWithFirstMessage
      .filter((conv) => conv.messages?.length > 0)
      .reduce((acc, conv) => {
        const userMessages = conv.messages.filter((m) => m.role === "user");
        if (userMessages.length > 0) {
          const firstMessage = userMessages[0].content;
          acc[firstMessage] = (acc[firstMessage] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    const topQueries = Object.entries(messageGroups)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([term, count]) => ({
        term: term.length > 50 ? term.substring(0, 50) + "..." : term,
        count,
      }));

    const dailyStats = await Promise.all(
      Array.from({ length: 7 }).map(async (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const successful = await prisma.conversation.count({
          where: {
            status: "completed",
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        });

        const failed = await prisma.conversation.count({
          where: {
            status: "failed",
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        });

        return {
          date: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
          successful,
          failed,
        };
      })
    );

    const successRate = (activeConversations / totalConversations) * 100;

    const conversationsWithMessages = await prisma.conversation.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    type QueryCategory = "Program Specific" | "University" | "Location Based" | "Fee Structure";

    const categoryKeywords: Record<QueryCategory, string[]> = {
      "Program Specific": ["course", "program", "major", "specialization", "degree"],
      University: ["university", "college", "institution", "campus", "school"],
      "Location Based": ["country", "city", "location", "region", "area"],
      "Fee Structure": ["fee", "cost", "tuition", "scholarship", "financial"],
    };

    const categoryCounts: Record<QueryCategory, number> = {
      "Program Specific": 0,
      University: 0,
      "Location Based": 0,
      "Fee Structure": 0,
    };

    conversationsWithMessages.forEach((conv) => {
      const userMessages = conv.messages.filter((m) => m.role === "user");
      const messageContent = userMessages.map((m) => m.content.toLowerCase()).join(" ");

      (Object.entries(categoryKeywords) as [QueryCategory, string[]][]).forEach(
        ([category, keywords]) => {
          if (keywords.some((keyword) => messageContent.includes(keyword))) {
            categoryCounts[category]++;
          }
        }
      );
    });

    const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0) || 1;
    const queryCategories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
    }));

    const avgDepth =
      conversationsWithMessages.length > 0
        ? conversationsWithMessages.reduce((acc, conv) => {
            const userMessages = conv.messages.filter((m) => m.role === "user").length;
            return acc + userMessages;
          }, 0) / conversationsWithMessages.length
        : 0;

    const uniqueUsers = await prisma.conversation.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        userId: true,
      },
      distinct: ["userId"],
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalSearches: totalConversations,
        successRate: Math.round(successRate),
        avgDepth: Number(avgDepth.toFixed(1)),
      },
      topSearches: topQueries,
      searchResultsData: dailyStats.reverse(),
      queryCategories: queryCategories,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error?.message ?? error }, { status: 500 });
  }
}
