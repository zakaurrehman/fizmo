/**
 * MT4/MT5 Trade Synchronization Service
 * Handles syncing trades from MT4/MT5 server to our database
 */

import { prisma } from "@/lib/prisma";
import { mt4Client, MT4WebAPIClient } from "@/lib/mt4-client";

interface SyncResult {
  success: boolean;
  accountId: string;
  tradesAdded: number;
  tradesUpdated: number;
  error?: string;
}

export class MT4SyncService {
  private client: MT4WebAPIClient;

  constructor(client: MT4WebAPIClient = mt4Client) {
    this.client = client;
  }

  /**
   * Map MT4 command type to trade direction
   * 0 = BUY, 1 = SELL
   */
  private getDirection(cmd: number): "BUY" | "SELL" {
    return cmd === 0 ? "BUY" : "SELL";
  }

  /**
   * Map MT4 trade status to our status
   * If close_time is set, trade is CLOSED, otherwise OPEN
   */
  private getStatus(closeTime: number): "OPEN" | "CLOSED" {
    return closeTime > 0 ? "CLOSED" : "OPEN";
  }

  /**
   * Sync trades for a single account
   */
  async syncAccountTrades(
    brokerAccountId: string,
    mt4Login: number
  ): Promise<SyncResult> {
    try {
      // Authenticate with MT4
      const authenticated = await this.client.authenticate();
      if (!authenticated) {
        return {
          success: false,
          accountId: brokerAccountId,
          tradesAdded: 0,
          tradesUpdated: 0,
          error: "Failed to authenticate with MT4 server",
        };
      }

      // Get trades from MT4
      const mt4Trades = await this.client.getTrades(mt4Login);
      if (!mt4Trades) {
        return {
          success: false,
          accountId: brokerAccountId,
          tradesAdded: 0,
          tradesUpdated: 0,
          error: "Failed to fetch trades from MT4",
        };
      }

      // Find the account in our database
      const account = await prisma.account.findUnique({
        where: { accountId: brokerAccountId },
        include: { trades: true },
      });

      if (!account) {
        return {
          success: false,
          accountId: brokerAccountId,
          tradesAdded: 0,
          tradesUpdated: 0,
          error: `Account not found: ${brokerAccountId}`,
        };
      }

      let tradesAdded = 0;
      let tradesUpdated = 0;

      // Sync each trade
      for (const mt4Trade of mt4Trades) {
        const externalId = `MT4_${mt4Trade.ticket}`;

        // Check if trade already exists
        const existingTrade = await prisma.trade.findFirst({
          where: { externalId },
        });

        if (existingTrade) {
          // Update existing trade
          await prisma.trade.update({
            where: { id: existingTrade.id },
            data: {
              symbol: mt4Trade.symbol,
              direction: this.getDirection(mt4Trade.cmd),
              openPrice: mt4Trade.open_price,
              closePrice: mt4Trade.close_price || null,
              volume: mt4Trade.volume,
              openTime: new Date(mt4Trade.open_time * 1000),
              closeTime: mt4Trade.close_time
                ? new Date(mt4Trade.close_time * 1000)
                : null,
              status: this.getStatus(mt4Trade.close_time),
              profit: mt4Trade.profit,
              commission: mt4Trade.commission,
              comment: mt4Trade.comment,
            },
          });
          tradesUpdated++;
        } else {
          // Create new trade
          await prisma.trade.create({
            data: {
              accountId: account.id,
              tradeId: externalId,
              symbol: mt4Trade.symbol,
              direction: this.getDirection(mt4Trade.cmd),
              openPrice: mt4Trade.open_price,
              closePrice: mt4Trade.close_price || null,
              volume: mt4Trade.volume,
              openTime: new Date(mt4Trade.open_time * 1000),
              closeTime: mt4Trade.close_time
                ? new Date(mt4Trade.close_time * 1000)
                : null,
              status: this.getStatus(mt4Trade.close_time),
              profit: mt4Trade.profit,
              commission: mt4Trade.commission,
              comment: mt4Trade.comment,
              externalId,
              provider: "MT4",
            },
          });
          tradesAdded++;
        }
      }

      // Update account stats
      await this.updateAccountStats(account.id);

      return {
        success: true,
        accountId: brokerAccountId,
        tradesAdded,
        tradesUpdated,
      };
    } catch (error: any) {
      console.error(`Error syncing trades for ${brokerAccountId}:`, error);
      return {
        success: false,
        accountId: brokerAccountId,
        tradesAdded: 0,
        tradesUpdated: 0,
        error: error.message,
      };
    } finally {
      await this.client.disconnect();
    }
  }

  /**
   * Sync all accounts for a broker
   */
  async syncBrokerAccounts(brokerId: string): Promise<SyncResult[]> {
    try {
      // Get all accounts for this broker
      const accounts = await prisma.account.findMany({
        where: {
          client: {
            brokerId,
          },
        },
      });

      const results: SyncResult[] = [];

      for (const account of accounts) {
        // Extract MT4 login from account metadata if available
        const mt4Login = account.mt4Login || parseInt(account.accountId);

        if (!isNaN(mt4Login)) {
          const result = await this.syncAccountTrades(
            account.accountId,
            mt4Login
          );
          results.push(result);

          // Add delay between syncs to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return results;
    } catch (error: any) {
      console.error(`Error syncing broker ${brokerId}:`, error);
      return [];
    }
  }

  /**
   * Update account statistics
   */
  private async updateAccountStats(accountId: string): Promise<void> {
    try {
      const trades = await prisma.trade.findMany({
        where: { accountId },
      });

      const winningTrades = trades.filter((t) => Number(t.profit || 0) > 0).length;

      await prisma.account.update({
        where: { id: accountId },
        data: {
          totalTrades: trades.length,
          winRate:
            trades.length > 0
              ? (winningTrades / trades.length) * 100
              : 0,
          lastSyncAt: new Date(),
        },
      });
    } catch (error) {
      console.error(`Error updating account stats for ${accountId}:`, error);
    }
  }

  /**
   * Schedule periodic sync (for background job)
   */
  scheduleSyncJob(intervalMs: number = 300000): NodeJS.Timer {
    return setInterval(async () => {
      try {
        const brokers = await prisma.broker.findMany();

        for (const broker of brokers) {
          console.log(`Syncing MT4 trades for broker: ${broker.id}`);
          const results = await this.syncBrokerAccounts(broker.id);

          // Log sync results
          results.forEach((result) => {
            if (result.success) {
              console.log(
                `✓ Synced ${result.accountId}: +${result.tradesAdded} new, +${result.tradesUpdated} updated`
              );
            } else {
              console.error(
                `✗ Failed to sync ${result.accountId}: ${result.error}`
              );
            }
          });
        }
      } catch (error) {
        console.error("Scheduled sync job error:", error);
      }
    }, intervalMs);
  }
}

// Export singleton instance
export const mt4SyncService = new MT4SyncService();
