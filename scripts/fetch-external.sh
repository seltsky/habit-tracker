#!/bin/bash
# fetch-external.sh — Apps Script에서 오늘 캘린더+태스크 가져와서 data/external/에 저장
# 매일 5시 cron으로 자동 실행 권장
#
# Usage: ./scripts/fetch-external.sh [YYYY-MM-DD]
# 날짜 생략 시 오늘

set -e

CONFIG="$HOME/.config/habit-quest/google-bridge.json"
if [ ! -f "$CONFIG" ]; then
  echo "❌ Config not found: $CONFIG"
  echo "Apps Script URL + token 설정 필요"
  exit 1
fi

URL=$(python3 -c "import json; print(json.load(open('$CONFIG'))['url'])")
TOKEN=$(python3 -c "import json; print(json.load(open('$CONFIG'))['token'])")

DATE="${1:-$(date +%Y-%m-%d)}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$REPO_DIR/data/external"
OUT_FILE="$OUT_DIR/$DATE.json"

mkdir -p "$OUT_DIR"

echo "🔄 Fetching $DATE from Apps Script..."
RESPONSE=$(curl -sL "${URL}?action=both&date=${DATE}&token=${TOKEN}")

# Validate JSON
if ! echo "$RESPONSE" | python3 -c "import sys,json; json.load(sys.stdin)" 2>/dev/null; then
  echo "❌ Invalid JSON response:"
  echo "$RESPONSE" | head -10
  exit 2
fi

# Pretty-print and save
echo "$RESPONSE" | python3 -m json.tool > "$OUT_FILE"

CAL_COUNT=$(python3 -c "import json; d=json.load(open('$OUT_FILE')); print(len(d.get('calendar',[])))")
TASK_COUNT=$(python3 -c "import json; d=json.load(open('$OUT_FILE')); print(len(d.get('tasks',[])))")

echo "✅ Saved $OUT_FILE"
echo "   Calendar: $CAL_COUNT events"
echo "   Tasks: $TASK_COUNT items"
