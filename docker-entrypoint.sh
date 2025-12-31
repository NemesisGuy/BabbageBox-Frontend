#!/bin/sh
set -e
# Create env.js at container start so runtime can override API base URL
# Prefer VITE_API_BASE_URL (set in compose), then FRONTEND_API_BASE_URL, then fallback
API="${VITE_API_BASE_URL:-${FRONTEND_API_BASE_URL:-}}"
if [ -z "$API" ]; then
  API="http://localhost:8000"
fi
cat > /usr/share/nginx/html/env.js <<EOF
window.API_BASE_URL = "$API";
EOF

# Exec the CMD
exec "$@"
