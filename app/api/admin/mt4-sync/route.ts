import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";
import { mt4SyncService } from "@/lib/mt4-sync";

/**
 * POST /api/admin/mt4-sync
 * Manually trigger MT4/MT5 trade sync for an account or entire broker
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const body = await request.json();
    const { accountId, mt4Login, syncAll } = body;

    if (syncAll) {
      // Sync all accounts for this broker
      const results = await mt4SyncService.syncBrokerAccounts(brokerId);

      return NextResponse.json({
        success: true,
        message: `Started sync for ${results.length} accounts`,
        results,
      });
    } else if (accountId && mt4Login) {
      // Sync single account
      const result = await mt4SyncService.syncAccountTrades(accountId, mt4Login);

      return NextResponse.json({
        success: result.success,
        message: result.success
          ? `Synced ${result.tradesAdded} new trades, updated ${result.tradesUpdated}`
          : result.error,
        result,
      });
    } else {
      return NextResponse.json(
        { error: "Provide either (accountId, mt4Login) or syncAll=true" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("MT4 sync error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/mt4-sync/status
 * Get sync status for all accounts
 */
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    // Import Prisma here to avoid circular dependency
    const { prisma } = await import("@/lib/prisma");

    if (accountId) {
      // Get status for single account
      const account = await prisma.account.findUnique({
        where: { accountId },
        include: {
          _count: {
            select: { trades: true },
          },
        },
      });

      if (!account) {
        return NextResponse.json({ error: "Account not found" }, { status: 404 });
      }

      return NextResponse.json({
        accountId: account.accountId,
        mt4Login: account.mt4Login,
        totalTrades: account.totalTrades,
        winRate: account.winRate,
        lastSyncAt: account.lastSyncAt,
        tradesInDb: account._count.trades,
      });
    } else {
      // Get status for all accounts
      const accounts = await prisma.account.findMany({
        where: {
          client: {
            brokerId,
          },
        },
        include: {
          _count: {
            select: { trades: true },
          },
        },
      });

      return NextResponse.json({
        totalAccounts: accounts.length,
        accounts: accounts.map((a) => ({
          accountId: a.accountId,
          mt4Login: a.mt4Login,
          totalTrades: a.totalTrades,
          winRate: a.winRate,
          lastSyncAt: a.lastSyncAt,
          tradesInDb: a._count.trades,
        })),
      });
    }
  } catch (error: any) {
    console.error("Get MT4 sync status error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
