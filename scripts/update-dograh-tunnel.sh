#!/usr/bin/env bash
set -e
# Refresh aithor-clone/index.html apiEndpoint with the current Dograh quick-tunnel URL.
# Dograh quick tunnels are ephemeral (trycloudflare.com); this script re-points the embed so
# https://logitechconsultants.com visitors can still reach your local Docker API.
# Usage: ./scripts/update-dograh-tunnel.sh
# Requires: docker + curl
TUNNEL=$(curl -s http://localhost:8000/api/v1/health | python3 -c "import sys,json; print(json.load(sys.stdin).get('tunnel_url',''))")
if [ -z "$TUNNEL" ] || [ "$TUNNEL" = "None" ]; then
  echo "No tunnel_url from http://localhost:8000/api/v1/health — is Docker up with --profile tunnel?"
  exit 1
fi
echo "Current tunnel: $TUNNEL"
# Replace apiEndpoint=... in index.html (keeps token & other params)
sed -i -E "s|apiEndpoint=https://[^'\"]+|apiEndpoint=$TUNNEL|g" index.html
echo "Updated index.html:"
grep -o "apiEndpoint=[^'\"]*" index.html | head -n 5
echo ""
echo "Also vendoring fresh widget (in case Dograh UI updated it)..."
cp ../dograh/ui/public/embed/dograh-widget.js public/dograh-widget.js 2>/dev/null || cp /home/karanja/Desktop/dograh/ui/public/embed/dograh-widget.js public/dograh-widget.js
echo "Done. Commit + redeploy aithor-clone to publish the new URL."
echo "  git add index.html public/dograh-widget.js && git commit -m 'chore: refresh Dograh tunnel URL' && git push"
