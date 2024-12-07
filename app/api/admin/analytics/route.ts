import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { subMonths, format } from "date-fns";

export async function GET() {
  try {
    const currentDate = new Date();
    const previousMonth = subMonths(currentDate, 1);

    const totalUsers = await prisma.user.count();
    const previousMonthUsers = await prisma.user.count();
    const userGrowthRate = calculatePercentageChange(previousMonthUsers, totalUsers);

    const totalConversations = await prisma.conversation.count();
    const activeConversations = await prisma.conversation.count({
      where: { status: "active" },
    });
    const previousMonthConversations = await prisma.conversation.count({
      where: {
        createdAt: {
          gte: previousMonth,
          lt: currentDate,
        },
      },
    });

    const conversationRate =
      totalConversations > 0 ? ((activeConversations / totalConversations) * 100).toFixed(1) : 0;
    const conversationTrend = calculatePercentageChange(
      previousMonthConversations,
      totalConversations
    );

    let monthlyTrends: any = [];
    try {
      const sixMonthsAgo = subMonths(currentDate, 6);

      const conversations = await prisma.conversation.findMany({
        where: {
          createdAt: {
            gte: sixMonthsAgo,
            lte: currentDate,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const monthlyGroups = conversations.reduce((acc, conv) => {
        const monthKey = format(conv.createdAt, "yyyy-MM");
        acc[monthKey] = (acc[monthKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      monthlyTrends = Object.entries(monthlyGroups)
        .map(([month, count]) => ({
          month,
          conversations: count,
        }))
        .slice(0, 6);
    } catch (error) {
      console.warn("Failed to aggregate monthly trends:", error);
    }

    const statusDistribution = await prisma.conversation.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    });

    const roleDistribution = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        _all: true,
      },
    });

    return NextResponse.json({
      success: true,
      analytics: {
        conversations: {
          rate: Number(conversationRate),
          trend: `${conversationTrend >= 0 ? "+" : ""}${conversationTrend.toFixed(1)}%`,
          total: totalConversations,
          active: activeConversations,
        },
        users: {
          total: totalUsers,
          trend: `${userGrowthRate >= 0 ? "+" : ""}${userGrowthRate.toFixed(1)}%`,
        },
      },
      trends: monthlyTrends,
      distributions: {
        conversationStatus: statusDistribution.map((status) => ({
          name: status.status,
          value: status._count._all,
        })),
        userRoles: roleDistribution.map((role) => ({
          name: role.role,
          value: role._count._all,
        })),
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

function calculatePercentageChange(previousValue: number, currentValue: number): number {
  if (previousValue === 0) return currentValue > 0 ? 100 : 0;
  return ((currentValue - previousValue) / previousValue) * 100;
}
