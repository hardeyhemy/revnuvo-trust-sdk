#!/usr/bin/env node
/**
 * @revnuvo/trust-mcp — MCP server exposing Revnuvo Trust to any AI agent.
 *
 * Tools:
 *   trust_verify  — resolve a company/domain to a legal entity + fraud score
 *   domain_trust  — DNS/infrastructure trust signals for a domain
 *
 * Payment: calls hit the x402 endpoint; agents pay $0.10/call in USDC (Base)
 * automatically via the x402 flow, or set REVNUVO_API_KEY for free-tier metering.
 *
 * Endpoints:
 *   x402:  https://api.revnuvo.site/v1/trust/verify
 *   Docs:  https://www.revnuvo.site/products/trust
 *
 * Run:  REVNUVO_API_KEY=... npx @revnuvo/trust-mcp
 *       (or connect via any MCP client; x402-capable clients need no key)
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const ENDPOINT = process.env.REVNUVO_ENDPOINT ?? "https://api.revnuvo.site/v1/trust/verify";

async function callTrust(payload) {
  const headers = { "content-type": "application/json" };
  if (process.env.REVNUVO_API_KEY) headers["X-Revnuvo-Key"] = process.env.REVNUVO_API_KEY;
  // x402 note: an x402-capable transport injects the X-PAYMENT header on 402 and retries.
  // Libraries: `x402-fetch` (npm) wraps fetch with automatic 402 handling in USDC (Base).
  const res = await fetch(ENDPOINT, { method: "POST", headers, body: JSON.stringify(payload) });
  if (res.status === 402) {
    const req = await res.json();
    throw new Error(
      `Payment required: $0.10 USDC (Base) to ${req.accepts?.[0]?.payTo}. ` +
      `Use an x402-capable client (npm i x402-fetch) or set REVNUVO_API_KEY.`
    );
  }
  if (!res.ok) throw new Error(`Trust API error ${res.status}`);
  return res.json();
}

const server = new McpServer({ name: "revnuvo-trust", version: "0.1.0" });

server.tool(
  "trust_verify",
  "Verify a company/domain: legal-entity resolution (200+ jurisdictions), beneficial ownership, sanctions/PEP flags, 0-100 fraud score. $0.10/call via x402.",
  {
    domain: z.string().optional().describe("Domain, e.g. example.com"),
    name: z.string().optional().describe("Legal or trade name, e.g. Example Ltd"),
    jurisdiction_hint: z.string().optional().describe("ISO jurisdiction hint, e.g. US-DE, GB"),
  },
  async ({ domain, name, jurisdiction_hint }) => {
    if (!domain && !name) return { content: [{ type: "text", text: "Provide domain or name." }] };
    const result = await callTrust({ domain, name, jurisdiction_hint });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

server.tool(
  "domain_trust",
  "DNS/infrastructure trust signals for a domain: age, fingerprints, fraud indicators. Part of Revnuvo Trust.",
  { domain: z.string().describe("Domain to assess") },
  async ({ domain }) => {
    const result = await callTrust({ domain, mode: "domain_trust" });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("revnuvo-trust MCP server running on stdio");
