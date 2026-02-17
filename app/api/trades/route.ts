import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { userId: user.id },
    });

    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    const accounts = await prisma.account.findMany({
      where: { clientId: client.id },
      select: { id: true },
    });

    const trades = await prisma.trade.findMany({
      where: { accountId: { in: accounts.map((a) => a.id) } },
      orderBy: { openTime: "desc" },
      take: 100,
    });

    // Calculate summary
    const completedTrades = trades.filter((t) => t.closeTime);
    const totalProfit = completedTrades.reduce((sum, t) => sum + (Number(t.profit) || 0), 0);
    const winningTrades = completedTrades.filter((t) => (Number(t.profit) || 0) > 0);
    const winRate = completedTrades.length > 0 ? (winningTrades.length / completedTrades.length) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        trades: trades.map((t) => ({
          id: t.id,
          ticket: t.tradeId,
          symbol: t.symbol,
          type: "BUY", // MT5 provides this but simplified here
          volume: Number(t.volume),
          openPrice: Number(t.openPrice),
          closePrice: Number(t.closePrice),
          openTime: t.openTime,
          closeTime: t.closeTime,
          profit: Number(t.profit),
          commission: Number(t.commission),
          swap: Number(t.swap),
        })),
        summary: {
          totalTrades: trades.length,
          completedTrades: completedTrades.length,
          openTrades: trades.length - completedTrades.length,
          totalProfit,
          winRate: Math.round(winRate),
        },
      },
    });
  } catch (error: any) {
    console.error("Trades error:", error);
    return NextResponse.json(
      { message: "Failed to fetch trades" },
      { status: 500 }
    );
  }
}
