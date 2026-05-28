#!/bin/bash
# Cary Park Solutions — session briefing hook
# Runs at the start of every Claude Code session to surface current context.
set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

echo "=== CARY PARK SOLUTIONS — SESSION BRIEFING ==="
echo "Date: $(date '+%A, %B %-d %Y')"
echo ""

# Git summary
echo "--- RECENT GIT ACTIVITY ---"
git -C "$PROJECT_DIR" log --oneline -8 2>/dev/null || echo "(no git history)"
echo ""

# Active branch
echo "Branch: $(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo 'unknown')"
echo ""

# Uncommitted changes
DIRTY=$(git -C "$PROJECT_DIR" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
if [ "$DIRTY" -gt "0" ]; then
  echo "⚠️  $DIRTY uncommitted file(s):"
  git -C "$PROJECT_DIR" status --short 2>/dev/null
  echo ""
fi

# Daily context
if [ -f "$PROJECT_DIR/data/context.md" ]; then
  echo "--- DAILY CONTEXT ---"
  cat "$PROJECT_DIR/data/context.md"
  echo ""
fi

# Active task
if [ -f "$PROJECT_DIR/data/active-task.md" ]; then
  echo "--- ACTIVE TASK ---"
  cat "$PROJECT_DIR/data/active-task.md"
  echo ""
fi

echo "=== END BRIEFING — Ready to work ==="
