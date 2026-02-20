/**
 * MT4/MT5 WebAPI Client
 * Handles authentication, connection, and command execution
 * Configure via environment variables: MT4_SERVER, MT4_PORT, MT4_LOGIN, MT4_PASSWORD
 */

import crypto from "crypto";
import https from "https";

interface AuthResponse {
  retcode: string;
  version_access: string;
  srv_rand: string;
}

interface CommandResponse {
  retcode: string;
  [key: string]: any;
}

interface TradeData {
  ticket: number;
  login: number;
  symbol: string;
  digits: number;
  cmd: number; // 0=BUY, 1=SELL
  volume: number;
  open_price: number;
  close_price: number;
  open_time: number;
  close_time: number;
  s_time: number;
  commission: number;
  profit: number;
  comment: string;
}

export class MT4WebAPIClient {
  private server: string;
  private port: number;
  private login: string;
  private password: string;
  private agent: https.Agent;
  private srvRand: string | null = null;
  private clientRand: string | null = null;
  private sessionId: string | null = null;

  constructor(
    server: string = process.env.MT4_SERVER || "",
    port: number = parseInt(process.env.MT4_PORT || "443"),
    login: string = process.env.MT4_LOGIN || "",
    password: string = process.env.MT4_PASSWORD || ""
  ) {
    this.server = server;
    this.port = port;
    this.login = login;
    this.password = password;
    this.agent = new https.Agent({
      rejectUnauthorized: false, // For self-signed certs
      keepAlive: true,
      maxSockets: 1,
    });
  }

  /**
   * Send HTTP request to MT4/MT5 server
   */
  private async sendRequest(
    path: string,
    method: "GET" | "POST" = "GET",
    body?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const headers: Record<string, string | number> = {
        "User-Agent": "MetaTrader 5 Web API/5.2005 (Windows NT 6.2; x64)",
        Connection: "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
      };

      if (body) {
        headers["Content-Length"] = body.length;
      }

      const options = {
        hostname: this.server,
        port: this.port,
        path,
        method,
        agent: this.agent,
        headers,
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on("error", reject);

      if (body) {
        req.write(body);
      }

      req.end();
    });
  }

  /**
   * Start authentication process
   */
  async authenticate(): Promise<boolean> {
    try {
      const version = "1290";
      const agent = "FizmoTrader";
      const path = `/api/auth/start?version=${version}&agent=${agent}&login=${this.login}`;

      const response = await this.sendRequest(path);
      const data = JSON.parse(response) as AuthResponse;

      if (data.retcode !== "0" && data.retcode !== "Done") {
        console.error("Auth start failed:", data);
        return false;
      }

      this.srvRand = data.srv_rand;

      // Calculate response
      const authAnswer = await this.calculateAuthAnswer(
        this.password,
        this.srvRand
      );

      // Send answer
      const answerPath = `/api/auth/answer?srv_rand_answer=${authAnswer.srv_rand_answer}&cli_rand=${authAnswer.cli_rand}`;
      const answerResponse = await this.sendRequest(answerPath);
      const answerData = JSON.parse(answerResponse) as CommandResponse;

      if (answerData.retcode === "0" || answerData.retcode === "Done") {
        this.sessionId = answerData.cli_rand_answer;
        console.log("MT4/MT5 Authentication successful");
        return true;
      }

      console.error("Auth answer failed:", answerData);
      return false;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    }
  }

  /**
   * Calculate authentication answer using MD5 hashing
   */
  private async calculateAuthAnswer(
    password: string,
    srvRand: string
  ): Promise<{ srv_rand_answer: string; cli_rand: string }> {
    // Step 1: MD5 hash of password with WebAPI string
    const md5_1 = crypto
      .createHash("md5")
      .update(`${password}WebAPI`)
      .digest("hex");

    // Step 2: Add WebAPI string as bytes and hash again
    const combined = Buffer.concat([
      Buffer.from(md5_1, "hex"),
      Buffer.from("WebAPI", "utf8"),
    ]);

    const md5_2 = crypto.createHash("md5").update(combined).digest("hex");

    // Step 3: Get final hash of the second result
    const md5_final = crypto.createHash("md5").update(md5_2).digest("hex");

    // Step 4: Combine password hash with srv_rand
    const srvRandBytes = Buffer.from(srvRand, "hex");
    const passwordHashBytes = Buffer.from(md5_final, "hex");

    const combined2 = Buffer.concat([passwordHashBytes, srvRandBytes]);
    const srv_rand_answer = crypto.createHash("md5").update(combined2).digest("hex");

    // Step 5: Generate client random
    const cli_rand = crypto.randomBytes(8).toString("hex");

    return {
      srv_rand_answer,
      cli_rand,
    };
  }

  /**
   * Get account information
   */
  async getAccountInfo(
    login: number
  ): Promise<{ [key: string]: any } | null> {
    try {
      if (!this.sessionId) {
        await this.authenticate();
      }

      const path = `/api/user/add?login=${login}`;
      const response = await this.sendRequest(path);
      const data = JSON.parse(response) as CommandResponse;

      if (data.retcode === "0") {
        return data;
      }

      console.error("Get account info failed:", data);
      return null;
    } catch (error) {
      console.error("Get account info error:", error);
      return null;
    }
  }

  /**
   * Get trades for a specific account
   */
  async getTrades(login: number): Promise<TradeData[] | null> {
    try {
      if (!this.sessionId) {
        await this.authenticate();
      }

      const path = `/api/user/trades?login=${login}`;
      const response = await this.sendRequest(path);
      const data = JSON.parse(response) as CommandResponse;

      if (data.retcode === "0" && data.trades) {
        return data.trades as TradeData[];
      }

      console.error("Get trades failed:", data);
      return null;
    } catch (error) {
      console.error("Get trades error:", error);
      return null;
    }
  }

  /**
   * Get trade history
   */
  async getTradeHistory(
    login: number,
    from?: number,
    to?: number
  ): Promise<TradeData[] | null> {
    try {
      if (!this.sessionId) {
        await this.authenticate();
      }

      let path = `/api/user/tradehistory?login=${login}`;
      if (from) path += `&from=${from}`;
      if (to) path += `&to=${to}`;

      const response = await this.sendRequest(path);
      const data = JSON.parse(response) as CommandResponse;

      if (data.retcode === "0" && data.trades) {
        return data.trades as TradeData[];
      }

      console.error("Get trade history failed:", data);
      return null;
    } catch (error) {
      console.error("Get trade history error:", error);
      return null;
    }
  }

  /**
   * Send custom command (for future extensions)
   */
  async sendCommand(
    command: string,
    params: Record<string, string | number>
  ): Promise<CommandResponse | null> {
    try {
      if (!this.sessionId) {
        await this.authenticate();
      }

      let path = `/api/${command}`;
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, String(value));
      });

      if (queryParams.toString()) {
        path += `?${queryParams.toString()}`;
      }

      const response = await this.sendRequest(path);
      return JSON.parse(response) as CommandResponse;
    } catch (error) {
      console.error("Send command error:", error);
      return null;
    }
  }

  /**
   * Check connection and ping server
   */
  async checkConnection(): Promise<boolean> {
    try {
      const path = `/api/test/access`;
      const response = await this.sendRequest(path);
      const data = JSON.parse(response) as CommandResponse;
      return data.retcode === "0" || data.retcode === "Done";
    } catch (error) {
      console.error("Connection check failed:", error);
      return false;
    }
  }

  /**
   * Close connection (quit)
   */
  async disconnect(): Promise<void> {
    try {
      await this.sendRequest("/api/quit");
      this.sessionId = null;
      this.srvRand = null;
      this.clientRand = null;
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  }
}

// Export singleton instance
export const mt4Client = new MT4WebAPIClient();
