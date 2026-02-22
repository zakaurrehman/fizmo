import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth, getBrokerIdFromToken } from "@/lib/auth";

// GET - Fetch audit logs generated from system activities (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brokerId = await getBrokerIdFromToken(request);
    if (!brokerId) {
      return NextResponse.json({ error: "Broker context not found" }, { status: 400 });
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const limit = parseInt(searchParams.get("limit") || "100");

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Generate audit logs from deposits within this broker
    const deposits = await prisma.deposit.findMany({
      where: { brokerId },
      take: limit / 2,
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    // Generate audit logs from withdrawals within this broker
    const withdrawals = await prisma.withdrawal.findMany({
      where: { brokerId },
      take: limit / 2,
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    const auditLogs: any[] = [];

    // Create audit logs from deposits
    deposits.forEach((deposit) => {
      const client = deposit.client;
      auditLogs.push({
        id: `DEP-${deposit.id}`,
        timestamp: deposit.createdAt,
        user: client.user.email,
        userId: client.id,
        action: "DEPOSIT_CREATED",
        entity: "Deposit",
        entityId: deposit.id,
        details: `Created deposit request for $${deposit.amount.toLocaleString()} via ${deposit.paymentMethod}`,
        ipAddress: "N/A", // Would come from session tracking
        severity: deposit.amount >= 10000 ? "HIGH" : "MEDIUM",
        category: "FINANCIAL",
      });

      // Add status change logs if not pending
      if (deposit.status !== "PENDING") {
        auditLogs.push({
          id: `DEP-STATUS-${deposit.id}`,
          timestamp: deposit.updatedAt || deposit.createdAt,
          user: "admin@fizmo.com", // Would track actual admin
          userId: "ADMIN",
          action: `DEPOSIT_${deposit.status}`,
          entity: "Deposit",
          entityId: deposit.id,
          details: `Changed deposit status to ${deposit.status} for client ${client.firstName} ${client.lastName} - Amount: $${deposit.amount.toLocaleString()}`,
          ipAddress: "N/A",
          severity: deposit.status === "REJECTED" ? "HIGH" : "MEDIUM",
          category: "FINANCIAL",
        });
      }
    });

    // Create audit logs from withdrawals
    withdrawals.forEach((withdrawal) => {
      const client = withdrawal.client;
      auditLogs.push({
        id: `WD-${withdrawal.id}`,
        timestamp: withdrawal.createdAt,
        user: client.user.email,
        userId: client.id,
        action: "WITHDRAWAL_CREATED",
        entity: "Withdrawal",
        entityId: withdrawal.id,
        details: `Created withdrawal request for $${withdrawal.amount.toLocaleString()} via ${withdrawal.paymentMethod}`,
        ipAddress: "N/A",
        severity: withdrawal.amount >= 10000 ? "HIGH" : "MEDIUM",
        category: "FINANCIAL",
      });

      // Add status change logs if not pending
      if (withdrawal.status !== "PENDING") {
        auditLogs.push({
          id: `WD-STATUS-${withdrawal.id}`,
          timestamp: withdrawal.updatedAt || withdrawal.createdAt,
          user: "admin@fizmo.com", // Would track actual admin
          userId: "ADMIN",
          action: `WITHDRAWAL_${withdrawal.status}`,
          entity: "Withdrawal",
          entityId: withdrawal.id,
          details: `Changed withdrawal status to ${withdrawal.status} for client ${client.firstName} ${client.lastName} - Amount: $${withdrawal.amount.toLocaleString()}`,
          ipAddress: "N/A",
          severity: withdrawal.status === "REJECTED" ? "HIGH" : "MEDIUM",
          category: "FINANCIAL",
        });
      }
    });

    // Sort by timestamp (most recent first)
    auditLogs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Filter by category if specified
    let filteredLogs = auditLogs;
    if (category !== "all") {
      filteredLogs = auditLogs.filter((log) => log.category === category);
    }

    // Calculate statistics
    const last24hLogs = auditLogs.filter(
      (log) => new Date(log.timestamp) >= last24h
    );

    const stats = {
      totalEvents24h: last24hLogs.length,
      criticalEvents: auditLogs.filter((log) => log.severity === "CRITICAL").length,
      highEvents: auditLogs.filter((log) => log.severity === "HIGH").length,
      mediumEvents: auditLogs.filter((log) => log.severity === "MEDIUM").length,
      financialActions: auditLogs.filter((log) => log.category === "FINANCIAL")
        .length,
    };

    // Top actions summary
    const actionCounts = auditLogs.reduce((acc: any, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    return NextResponse.json({
      logs: filteredLogs.slice(0, limit),
      stats,
      topActions,
      total: filteredLogs.length,
    });
  } catch (error: any) {
    console.error("Audit logs fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
