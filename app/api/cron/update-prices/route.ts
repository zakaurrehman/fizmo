import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getForexRate, calculatePriceChange, MAJOR_FOREX_PAIRS } from "@/lib/market-data";

/**
 * Cron job to update forex prices from Alpha Vantage
 * This endpoint should be called every 5 minutes by Vercel Cron
 *
 * GET /api/cron/update-prices
 */
export async function GET(request: NextRequest) {
  try {
    console.log("Starting price update cron job...");

    // Verify cron job authorization (Vercel cron secret)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // In production, verify the cron secret
    if (process.env.NODE_ENV === "production" && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const updatedPrices: any[] = [];
    const errors: any[] = [];

    // Update first 4 major pairs (to stay within API limits)
    // Alpha Vantage free tier: 5 calls/min, 500/day
    // We'll update 4 pairs per run to stay safe
    const pairsToUpdate = MAJOR_FOREX_PAIRS.slice(0, 4);

    for (const pair of pairsToUpdate) {
      try {
        console.log(`Fetching ${pair.symbol}...`);

        // Fetch latest price from Alpha Vantage
        const quote = await getForexRate(pair.from, pair.to);

        if (!quote) {
          errors.push({
            symbol: pair.symbol,
            error: "Failed to fetch quote from Alpha Vantage",
          });
          continue;
        }

        // Get previous price from database
        const previousPrice = await prisma.forexPrice.findUnique({
          where: { symbol: pair.symbol },
        });

        // Calculate price change
        let change = null;
        let changePercent = null;
        let previousRate = null;

        if (previousPrice) {
          previousRate = previousPrice.exchangeRate;
          const priceChange = calculatePriceChange(
            quote.exchangeRate,
            parseFloat(previousPrice.exchangeRate.toString())
          );
          change = priceChange.change;
          changePercent = priceChange.changePercent;
        }

        // Upsert price in database
        const updatedPrice = await prisma.forexPrice.upsert({
          where: { symbol: pair.symbol },
          update: {
            exchangeRate: quote.exchangeRate,
            bidPrice: quote.bidPrice,
            askPrice: quote.askPrice,
            previousRate: previousRate,
            change: change,
            changePercent: changePercent,
            lastUpdated: new Date(),
          },
          create: {
            symbol: pair.symbol,
            fromCurrency: quote.fromCurrency,
            toCurrency: quote.toCurrency,
            exchangeRate: quote.exchangeRate,
            bidPrice: quote.bidPrice,
            askPrice: quote.askPrice,
            previousRate: null,
            change: null,
            changePercent: null,
          },
        });

        updatedPrices.push({
          symbol: updatedPrice.symbol,
          rate: updatedPrice.exchangeRate.toString(),
          change: updatedPrice.change?.toString() || "0",
          changePercent: updatedPrice.changePercent?.toString() || "0",
        });

        console.log(`Updated ${pair.symbol}: ${quote.exchangeRate}`);

        // Wait 13 seconds between API calls to respect rate limit (5 calls/min)
        if (pairsToUpdate.indexOf(pair) < pairsToUpdate.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 13000));
        }
      } catch (error: any) {
        console.error(`Error updating ${pair.symbol}:`, error);
        errors.push({
          symbol: pair.symbol,
          error: error.message,
        });
      }
    }

    console.log("Price update cron job completed");

    return NextResponse.json({
      success: true,
      message: "Prices updated successfully",
      updated: updatedPrices.length,
      errors: errors.length,
      data: {
        updatedPrices,
        errors,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update prices",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Manual trigger endpoint (for testing)
 * Can be called directly to test price updates
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds max execution time
