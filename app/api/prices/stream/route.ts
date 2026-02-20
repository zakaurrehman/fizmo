import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Server-Sent Events (SSE) endpoint for live price streaming
 * Sends updated forex prices to connected clients every 5 seconds
 */
export async function GET(request: NextRequest) {
  // Create a readable stream for SSE
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial comment to keep connection alive
      controller.enqueue(encoder.encode(": price stream started\n\n"));

      // Helper to send price updates
      const sendPrices = async () => {
        try {
          // Fetch latest prices from database
          const prices = await prisma.forexPrice.findMany({
            orderBy: { updatedAt: "desc" },
          });

          if (prices.length > 0) {
            const event = `data: ${JSON.stringify({
              prices: prices.map((p) => ({
                symbol: p.symbol,
                price: p.price,
                timestamp: p.updatedAt,
              })),
              timestamp: new Date().toISOString(),
            })}\n\n`;

            controller.enqueue(encoder.encode(event));
          }
        } catch (error) {
          console.error("Error sending prices:", error);
          const errorEvent = `data: ${JSON.stringify({
            error: "Failed to fetch prices",
          })}\n\n`;
          controller.enqueue(encoder.encode(errorEvent));
        }
      };

      // Send initial prices immediately
      await sendPrices();

      // Set up interval to send prices every 5 seconds
      const interval = setInterval(async () => {
        try {
          await sendPrices();
        } catch (error) {
          console.error("Error in price stream interval:", error);
          clearInterval(interval);
          controller.close();
        }
      }, 5000);

      // Clean up on client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
