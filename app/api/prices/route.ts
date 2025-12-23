import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/prices
 * Get current forex prices from database
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");

    if (symbol) {
      // Get specific symbol
      const price = await prisma.forexPrice.findUnique({
        where: { symbol },
      });

      if (!price) {
        return NextResponse.json(
          { error: "Price not found for symbol" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        price: {
          symbol: price.symbol,
          fromCurrency: price.fromCurrency,
          toCurrency: price.toCurrency,
          exchangeRate: price.exchangeRate.toString(),
          bidPrice: price.bidPrice.toString(),
          askPrice: price.askPrice.toString(),
          change: price.change?.toString() || "0",
          changePercent: price.changePercent?.toString() || "0",
          lastUpdated: price.lastUpdated,
        },
      });
    }

    // Get all prices
    const prices = await prisma.forexPrice.findMany({
      orderBy: { symbol: "asc" },
    });

    return NextResponse.json({
      success: true,
      count: prices.length,
      prices: prices.map((price) => ({
        symbol: price.symbol,
        fromCurrency: price.fromCurrency,
        toCurrency: price.toCurrency,
        exchangeRate: price.exchangeRate.toString(),
        bidPrice: price.bidPrice.toString(),
        askPrice: price.askPrice.toString(),
        change: price.change?.toString() || "0",
        changePercent: price.changePercent?.toString() || "0",
        lastUpdated: price.lastUpdated,
      })),
    });
  } catch (error: any) {
    console.error("Get prices error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch prices",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
