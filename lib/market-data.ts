/**
 * Market Data Library
 * Fetches real-time forex prices from Alpha Vantage API
 */

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

export interface ForexQuote {
  symbol: string;
  fromCurrency: string;
  toCurrency: string;
  exchangeRate: number;
  bidPrice: number;
  askPrice: number;
  timestamp: string;
}

export interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
}

/**
 * Fetch real-time forex exchange rate
 */
export async function getForexRate(
  fromCurrency: string,
  toCurrency: string
): Promise<ForexQuote | null> {
  try {
    const url = `${BASE_URL}?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    // Check for API errors
    if (data["Error Message"]) {
      console.error("Alpha Vantage API Error:", data["Error Message"]);
      return null;
    }

    if (data["Note"]) {
      console.warn("Alpha Vantage API Limit:", data["Note"]);
      return null;
    }

    const realtimeData = data["Realtime Currency Exchange Rate"];
    if (!realtimeData) {
      console.error("No realtime data available");
      return null;
    }

    return {
      symbol: `${fromCurrency}/${toCurrency}`,
      fromCurrency: realtimeData["1. From_Currency Code"],
      toCurrency: realtimeData["3. To_Currency Code"],
      exchangeRate: parseFloat(realtimeData["5. Exchange Rate"]),
      bidPrice: parseFloat(realtimeData["8. Bid Price"]),
      askPrice: parseFloat(realtimeData["9. Ask Price"]),
      timestamp: realtimeData["6. Last Refreshed"],
    };
  } catch (error) {
    console.error("Error fetching forex rate:", error);
    return null;
  }
}

/**
 * Fetch multiple forex pairs at once
 */
export async function getMultipleForexRates(
  pairs: Array<{ from: string; to: string }>
): Promise<ForexQuote[]> {
  const quotes: ForexQuote[] = [];

  for (const pair of pairs) {
    const quote = await getForexRate(pair.from, pair.to);
    if (quote) {
      quotes.push(quote);
    }
    // Add small delay to respect rate limits (5 calls/min = 12 seconds between calls)
    await new Promise((resolve) => setTimeout(resolve, 13000));
  }

  return quotes;
}

/**
 * Get popular forex pairs
 */
export async function getPopularForexPairs(): Promise<ForexQuote[]> {
  const popularPairs = [
    { from: "EUR", to: "USD" }, // EUR/USD
    { from: "GBP", to: "USD" }, // GBP/USD
    { from: "USD", to: "JPY" }, // USD/JPY
    { from: "USD", to: "CHF" }, // USD/CHF
  ];

  return await getMultipleForexRates(popularPairs);
}

/**
 * Calculate price change and percentage
 */
export function calculatePriceChange(
  currentPrice: number,
  previousPrice: number
): { change: number; changePercent: number } {
  const change = currentPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;

  return {
    change: parseFloat(change.toFixed(5)),
    changePercent: parseFloat(changePercent.toFixed(2)),
  };
}

/**
 * Format price for display
 */
export function formatPrice(price: number, decimals: number = 5): string {
  return price.toFixed(decimals);
}

/**
 * Format forex symbol (e.g., EURUSD -> EUR/USD)
 */
export function formatForexSymbol(symbol: string): string {
  if (symbol.includes("/")) return symbol;
  // Assume 6-character symbols (EURUSD, GBPUSD, etc.)
  if (symbol.length === 6) {
    return `${symbol.substring(0, 3)}/${symbol.substring(3, 6)}`;
  }
  return symbol;
}

/**
 * Get major forex pairs (for quick reference)
 */
export const MAJOR_FOREX_PAIRS = [
  { symbol: "EUR/USD", from: "EUR", to: "USD", name: "Euro / US Dollar" },
  { symbol: "GBP/USD", from: "GBP", to: "USD", name: "British Pound / US Dollar" },
  { symbol: "USD/JPY", from: "USD", to: "JPY", name: "US Dollar / Japanese Yen" },
  { symbol: "USD/CHF", from: "USD", to: "CHF", name: "US Dollar / Swiss Franc" },
  { symbol: "AUD/USD", from: "AUD", to: "USD", name: "Australian Dollar / US Dollar" },
  { symbol: "USD/CAD", from: "USD", to: "CAD", name: "US Dollar / Canadian Dollar" },
  { symbol: "NZD/USD", from: "NZD", to: "USD", name: "New Zealand Dollar / US Dollar" },
];
