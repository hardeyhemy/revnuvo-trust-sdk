# revnuvo-trust

**Python client for the Revnuvo Trust API** — verify companies, domains and counterparties before transacting with them.

- Entity resolution across **200+ jurisdictions**
- **UBO** discovery to 25% · **sanctions / PEP screening**
- DNS-fingerprint **0–100 fraud scoring**
- Sub-200ms, Cloudflare edge · **x402-payable** ($0.10/call USDC on Base) or API key

```python
from revnuvo_trust import TrustClient

client = TrustClient()                       # x402 pay-per-call mode
# client = TrustClient(api_key="rnv_...")    # subscription / free tier

result = client.verify("example.com")
print(result)
```

CLI:

```bash
revnuvo-trust example.com
```

Direct API: `POST https://api.revnuvo.site/v1/trust/verify` — unpaid calls return an
x402 402 with full payment instructions (self-describing, agent-friendly).

Free tier (100 calls/mo): https://www.revnuvo.site · llms.txt: https://revnuvo.site/llms.txt

MIT © Revnuvo Technologies Ltd
