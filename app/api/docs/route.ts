import { NextRequest, NextResponse } from "next/server";

/**
 * Simple API documentation endpoint
 * Returns a summary of all available API endpoints
 */
export async function GET(request: NextRequest) {
  const apiDocs = {
    title: "Fizmo Trader API",
    version: "1.0.0",
    description:
      "Complete trading platform API with authentication, account management, and admin controls",
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    authentication: {
      type: "JWT Bearer Token",
      header: "Authorization: Bearer {token}",
      location: "localStorage key: fizmo_token",
    },
    endpoints: {
      auth: [
        {
          method: "POST",
          path: "/api/auth/login",
          description: "User login",
          auth: false,
          params: { email: "string", password: "string" },
        },
        {
          method: "POST",
          path: "/api/auth/register",
          description: "New user registration",
          auth: false,
          params: {
            email: "string",
            password: "string",
            firstName: "string",
            lastName: "string",
          },
        },
        {
          method: "POST",
          path: "/api/auth/logout",
          description: "User logout",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/auth/me",
          description: "Get current user info",
          auth: true,
        },
      ],
      client: [
        {
          method: "GET",
          path: "/api/accounts",
          description: "List user trading accounts",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/accounts",
          description: "Create new trading account",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/deposits",
          description: "List deposits",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/deposits",
          description: "Request deposit",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/withdrawals",
          description: "List withdrawals",
          auth: true,
        },
        {
          method: "POST",
          path: "/api/withdrawals",
          description: "Request withdrawal",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/transactions",
          description: "Transaction history (limit: 100)",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/trades",
          description: "Trading history (limit: 100)",
          auth: true,
        },
        {
          method: "GET",
          path: "/api/prices",
          description: "Current forex prices",
          auth: false,
        },
        {
          method: "GET",
          path: "/api/prices/stream",
          description: "Live price feed (SSE)",
          auth: false,
        },
      ],
      admin: [
        {
          method: "GET",
          path: "/api/admin/dashboard",
          description: "Admin dashboard stats",
          auth: true,
          role: "ADMIN",
        },
        {
          method: "GET",
          path: "/api/admin/clients?page=1&limit=50",
          description: "List clients (paginated)",
          auth: true,
          role: "ADMIN",
        },
        {
          method: "GET",
          path: "/api/admin/deposits?page=1&limit=50",
          description: "List deposits (paginated)",
          auth: true,
          role: "ADMIN",
        },
        {
          method: "PATCH",
          path: "/api/admin/deposits",
          description: "Approve/reject deposit",
          auth: true,
          role: "ADMIN",
          params: { depositId: "string", status: "COMPLETED|REJECTED" },
        },
        {
          method: "GET",
          path: "/api/admin/withdrawals?page=1&limit=50",
          description: "List withdrawals (paginated)",
          auth: true,
          role: "ADMIN",
        },
        {
          method: "PATCH",
          path: "/api/admin/withdrawals",
          description: "Approve/reject withdrawal",
          auth: true,
          role: "ADMIN",
          params: { withdrawalId: "string", status: "COMPLETED|REJECTED" },
        },
        {
          method: "GET",
          path: "/api/admin/transactions?page=1&limit=50",
          description: "Transaction audit trail (paginated)",
          auth: true,
          role: "ADMIN",
        },
        {
          method: "GET",
          path: "/api/admin/accounts?page=1&limit=50",
          description: "List trading accounts (paginated)",
          auth: true,
          role: "ADMIN",
        },
        {
          method: "GET",
          path: "/api/admin/kyc",
          description: "KYC documents for review",
          auth: true,
          role: "ADMIN",
        },
        {
          method: "PUT",
          path: "/api/admin/kyc",
          description: "Approve/reject KYC",
          auth: true,
          role: "ADMIN",
          params: {
            documentId: "string",
            status: "APPROVED|REJECTED",
            rejectionReason: "string (optional)",
          },
        },
        {
          method: "GET",
          path: "/api/admin/aml",
          description: "AML monitoring data",
          auth: true,
          role: "ADMIN",
        },
        {
          method: "GET",
          path: "/api/admin/audit",
          description: "Audit logs",
          auth: true,
          role: "ADMIN",
        },
        {
          method: "GET",
          path: "/api/admin/reports",
          description: "Analytics reports",
          auth: true,
          role: "ADMIN",
        },
      ],
      rateLimit: {
        login: "5 attempts per minute per IP",
        register: "3 attempts per hour per IP",
        forgotPassword: "5 attempts per hour per IP",
      },
    },
    paginationExample: {
      request: "GET /api/admin/clients?page=1&limit=50",
      response: {
        clients: [],
        pagination: {
          page: 1,
          limit: 50,
          total: 2847,
          totalPages: 57,
        },
      },
    },
    errorCodes: {
      400: "Bad request",
      401: "Unauthorized",
      403: "Forbidden (insufficient permissions)",
      404: "Resource not found",
      429: "Too many requests (rate limited)",
      500: "Server error",
    },
  };

  return NextResponse.json(apiDocs);
}
