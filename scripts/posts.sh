#!/usr/bin/env bash
set -euo pipefail

# scripts/posts.sh — flip post statuses + list posts in studio-runs/posts.json
#
# Usage:
#   posts.sh list
#   posts.sh ready <post-id>
#   posts.sh publish <post-id>
#   posts.sh draft <post-id>

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
POSTS="$ROOT/studio-runs/posts.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required (brew install jq)" >&2
  exit 1
fi

if [[ ! -f "$POSTS" ]]; then
  echo "error: $POSTS not found" >&2
  exit 1
fi

cmd="${1:-}"

case "$cmd" in
  list)
    jq -r '.posts | sort_by(.updated_at) | reverse | .[] | [.status, .id, .title] | @tsv' "$POSTS" \
      | awk -F'\t' '{ printf "%-10s %-40s %s\n", $1, $2, $3 }'
    ;;

  ready|publish|draft)
    id="${2:-}"
    [[ -z "$id" ]] && { echo "usage: posts.sh $cmd <post-id>" >&2; exit 1; }

    new_status="$cmd"
    [[ "$cmd" == "publish" ]] && new_status="published"

    now="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
    tmp="$(mktemp)"
    jq --arg id "$id" --arg status "$new_status" --arg now "$now" '
      .posts |= map(
        if .id == $id then .status = $status | .updated_at = $now else . end
      )
    ' "$POSTS" > "$tmp"

    if ! jq -e --arg id "$id" '.posts | map(select(.id == $id)) | length > 0' "$tmp" >/dev/null; then
      rm -f "$tmp"
      echo "error: no post with id '$id'" >&2
      exit 1
    fi

    mv "$tmp" "$POSTS"
    echo "ok: $id → $new_status"
    ;;

  *)
    cat <<EOF >&2
usage:
  posts.sh list
  posts.sh ready <post-id>
  posts.sh publish <post-id>
  posts.sh draft <post-id>
EOF
    exit 1
    ;;
esac
