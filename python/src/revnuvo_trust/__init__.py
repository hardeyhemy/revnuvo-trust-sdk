"""Revnuvo Trust API client — verify companies, domains and counterparties.

x402-native: without an API key, unpaid requests return the server's HTTP 402
payment spec (USDC on Base, $0.10/call). With an API key (free tier or
subscription), verification results are returned directly.
"""
from __future__ import annotations

import json
import os
from typing import Any, Dict, Optional

import requests

API_BASE = "https://api.revnuvo.site"
VERIFY_ENDPOINT = f"{API_BASE}/v1/trust/verify"

__all__ = ["TrustClient", "TrustError", "__version__"]
__version__ = "0.1.0"


class TrustError(RuntimeError):
    """Raised when the Trust API returns a non-verification response."""


class TrustClient:
    """Client for POST https://api.revnuvo.site/v1/trust/verify."""

    def __init__(self, api_key: Optional[str] = None, timeout: float = 30.0):
        self.api_key = api_key or os.environ.get("REVNUVO_API_KEY")
        self.timeout = timeout

    def verify(self, domain: str = "", url: str = "") -> Dict[str, Any]:
        """Verify a domain (e.g. "nekuda.ai") or a full URL."""
        payload: Dict[str, str] = {}
        if domain:
            payload["domain"] = domain
        elif url:
            payload["url"] = url
        else:
            raise ValueError("provide domain= or url=")

        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        resp = requests.post(
            VERIFY_ENDPOINT, json=payload, headers=headers, timeout=self.timeout
        )

        if resp.status_code == 402:
            spec = resp.json()
            raise TrustError(
                "Payment required (x402). Pay $0.10 USDC on Base to "
                f"{spec.get('accepts', [{}])[0].get('payTo', 'service wallet')} "
                "and retry with the X-PAYMENT header — or set REVNUVO_API_KEY "
                "(free tier: https://www.revnuvo.site). Payment spec follows: "
                + json.dumps(spec.get("accepts", []))
            )
        if resp.status_code != 200:
            raise TrustError(f"Trust API error {resp.status_code}: {resp.text[:300]}")

        return resp.json()

    def score(self, domain: str) -> int:
        """Convenience: return just the 0-100 trust score."""
        data = self.verify(domain=domain)
        return int(data.get("trust_score", data.get("score", -1)))
