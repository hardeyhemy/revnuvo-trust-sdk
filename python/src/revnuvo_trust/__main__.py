"""CLI entry: revnuvo-trust <domain>"""
import json
import sys

from . import TrustClient, TrustError


def main() -> int:
    if len(sys.argv) < 2:
        print('usage: revnuvo-trust <domain|url>', file=sys.stderr)
        return 2
    target = sys.argv[1]
    client = TrustClient()
    try:
        result = client.verify(
            domain=target if "://" not in target else "",
            url=target if "://" in target else "",
        )
    except TrustError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
