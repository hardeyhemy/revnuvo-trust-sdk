# @revnuvo/trust-mcp

**MCP server for the Revnuvo Trust API** — let any AI agent verify companies, domains and counterparties before transacting with them.

- Entity resolution across **200+ jurisdictions**
- **UBO** (ultimate beneficial owner) discovery to 25%
- **Sanctions / PEP screening**
- DNS-fingerprint **0–100 fraud scoring**
- Sub-200ms responses, served from Cloudflare edge

## Tools

| Tool | What it does |
|---|---|
| `trust_verify` | Full trust verification for a domain or URL: trust score, reachability, HTTPS, latency, fraud signals |
| `domain_trust` | Lightweight domain-level score for quick pre-transaction screens |

## Payment — x402 native

The underlying Trust API is **x402-payable**: no account needed. Agents pay **$0.10/call in USDC on Base** directly to the service wallet via the HTTP 402 flow. Supply an API key instead if you have a Revnuvo subscription (free tier: 100 calls/month → https://www.revnuvo.site).

```bash
# Run the server
npx revnuvo-trust-mcp

# Env (either path):
REVNUVO_API_KEY=rnv_...        # API-key mode (free tier / subscription)
# or nothing — x402 mode, pay-per-call USDC on Base
```

## Claude Desktop / any MCP client

```json
{
  "mcpServers": {
    "revnuvo-trust": {
      "command": "npx",
      "args": ["revnuvo-trust-mcp"]
    }
  }
}
```

## Direct API (no MCP)

```bash
curl -X POST https://api.revnuvo.site/v1/trust/verify \
  -H "Content-Type: application/json" \
  -d '{"domain":"example.com"}'
# → 402 with x402 payment spec, or result with API key
```

Learn more: https://www.revnuvo.site · llms.txt: https://revnuvo.site/llms.txt

MIT © Revnuvo Technologies Ltd
