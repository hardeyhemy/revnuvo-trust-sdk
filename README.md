# Revnuvo Trust SDK

**MCP server + Python client for the [Revnuvo Trust API](https://www.revnuvo.site/products/trust)** — let any AI agent or application verify companies, domains and counterparties *before* transacting with them.

- Entity resolution across **200+ jurisdictions**
- **UBO** (ultimate beneficial owner) discovery to 25%
- **Sanctions / PEP screening**
- DNS-fingerprint **0–100 fraud scoring**
- Sub-200ms responses, Cloudflare edge
- **x402-native payments** — $0.10/call in USDC on Base, no account required

> Why it matters: agents now transact autonomously. Revnuvo is the trust check *before* the payment — who is this counterparty, are they sanctioned, does their DNS fingerprint look like fraud?

## Live endpoints

| Surface | URL |
|---|---|
| Trust API (x402) | `POST https://api.revnuvo.site/v1/trust/verify` |
| Service info | `GET https://api.revnuvo.site/` |
| Machine discovery | https://revnuvo.site/llms.txt |
| x402 payment spec | https://revnuvo.site/.well-known/x402.json |

Unpaid `POST /v1/trust/verify` returns **HTTP 402** with a self-describing x402 payment spec — any x402-capable agent learns how to pay on first contact.

## Packages

### MCP server — `revnuvo-trust-mcp` (npm, see [`mcp/`](mcp/))

```json
{
  "mcpServers": {
    "revnuvo-trust": {
      "command": "npx",
      "args": ["-y", "revnuvo-trust-mcp"]
    }
  }
}
```

Tools: `trust_verify` (full verification) · `domain_trust` (quick 0–100 score).

### Python client — `revnuvo-trust` (PyPI, see [`python/`](python/))

```python
from revnuvo_trust import TrustClient

client = TrustClient()                    # x402 pay-per-call mode
# client = TrustClient(api_key="rnv_...") # free tier / subscription
print(client.verify("example.com"))
```

```bash
revnuvo-trust example.com
```

## Payment modes

1. **x402 pay-per-call** — no signup. Agent pays $0.10 USDC (Base) per call via the HTTP 402 flow. Settlement wallet: `0x2aaD494F3f2f3f30E464cB84442924d764f19CE7`.
2. **API key** — [free tier: 100 calls/month](https://www.revnuvo.site) or $29/$199 subscriptions.

## Registry submissions

This repo is the source of truth for:
- Official MCP Registry manifest: [`server.json`](server.json)
- Smithery: [`smithery.yaml`](smithery.yaml)
- npm package: [`mcp/`](mcp/) · PyPI package: [`python/`](python/)

## License

MIT © Revnuvo Technologies Ltd
