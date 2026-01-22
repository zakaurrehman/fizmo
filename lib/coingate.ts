// CoinGate API configuration
// Docs: https://developer.coingate.com/docs

const COINGATE_API_URL = process.env.COINGATE_ENVIRONMENT === "live"
  ? "https://api.coingate.com/v2"
  : "https://api-sandbox.coingate.com/v2";

const COINGATE_API_KEY = process.env.COINGATE_API_KEY || "";

interface CreateOrderParams {
  orderId: string;
  amount: number;
  currency: string;
  receiveCurrency?: string;
  title?: string;
  description?: string;
  callbackUrl: string;
  cancelUrl: string;
  successUrl: string;
}

interface CoinGateOrder {
  id: number;
  status: string;
  price_currency: string;
  price_amount: string;
  receive_currency: string;
  receive_amount: string;
  payment_url: string;
  token: string;
}

export async function createCoinGateOrder(params: CreateOrderParams): Promise<CoinGateOrder> {
  const response = await fetch(`${COINGATE_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Token ${COINGATE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      order_id: params.orderId,
      price_amount: params.amount,
      price_currency: params.currency,
      receive_currency: params.receiveCurrency || "USD",
      title: params.title || "Trading Account Deposit",
      description: params.description || "Deposit to Fizmo Trader account",
      callback_url: params.callbackUrl,
      cancel_url: params.cancelUrl,
      success_url: params.successUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create CoinGate order");
  }

  return response.json();
}

export async function getCoinGateOrder(orderId: number): Promise<CoinGateOrder> {
  const response = await fetch(`${COINGATE_API_URL}/orders/${orderId}`, {
    headers: {
      "Authorization": `Token ${COINGATE_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get CoinGate order");
  }

  return response.json();
}
