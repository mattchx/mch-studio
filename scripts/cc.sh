#!/bin/bash
# MCH Studio CLI — used by Claude Code agent to interact with Supabase
# Usage: ./scripts/cc.sh <command> [args]

source ~/.zshrc 2>/dev/null || true
set -eo pipefail

BASE="$CC_SUPABASE_URL/rest/v1"
AUTH="Authorization: Bearer $CC_SUPABASE_SERVICE_KEY"
KEY="apikey: $CC_SUPABASE_SERVICE_KEY"
JSON="Content-Type: application/json"
STORAGE="$CC_SUPABASE_URL/storage/v1"

case "${1:-help}" in

  # --- Clients ---

  list-clients)
    curl -s "$BASE/clients?select=id,slug,business_name,category&order=business_name" \
      -H "$AUTH" -H "$KEY" | python3 -m json.tool
    ;;

  get-client)
    # Usage: cc.sh get-client <slug>
    curl -s "$BASE/clients?slug=eq.${2}&select=*" \
      -H "$AUTH" -H "$KEY" | python3 -m json.tool
    ;;

  get-profile)
    # Usage: cc.sh get-profile <client_id>
    curl -s "$BASE/client_profiles?client_id=eq.${2}&select=*" \
      -H "$AUTH" -H "$KEY" | python3 -m json.tool
    ;;

  add-client)
    # Usage: cc.sh add-client '{"slug":"...","business_name":"...","category":"...",...}'
    curl -s -X POST "$BASE/clients" \
      -H "$AUTH" -H "$KEY" -H "$JSON" -H "Prefer: return=representation" \
      -d "$2" | python3 -m json.tool
    ;;

  add-profile)
    # Usage: cc.sh add-profile '{"client_id":"...","brand_voice":"...","key_services":["..."],...}'
    curl -s -X POST "$BASE/client_profiles" \
      -H "$AUTH" -H "$KEY" -H "$JSON" -H "Prefer: return=representation" \
      -d "$2" | python3 -m json.tool
    ;;

  update-client)
    # Usage: cc.sh update-client <slug> '{"category":"...",...}'
    curl -s -X PATCH "$BASE/clients?slug=eq.${2}" \
      -H "$AUTH" -H "$KEY" -H "$JSON" -H "Prefer: return=representation" \
      -d "$3" | python3 -m json.tool
    ;;

  # --- Content ---

  push-content)
    # Usage: cc.sh push-content '{"client_id":"...","content_type":"social","title":"...","body":"...",...}'
    curl -s -X POST "$BASE/content_items" \
      -H "$AUTH" -H "$KEY" -H "$JSON" -H "Prefer: return=representation" \
      -d "$2" | python3 -m json.tool
    ;;

  push-batch)
    # Usage: cc.sh push-batch '[{...},{...},...]'  (array of content items)
    curl -s -X POST "$BASE/content_items" \
      -H "$AUTH" -H "$KEY" -H "$JSON" -H "Prefer: return=representation" \
      -d "$2" | python3 -m json.tool
    ;;

  list-content)
    # Usage: cc.sh list-content [client_id] [status]
    FILTER=""
    [[ -n "${2:-}" ]] && FILTER="&client_id=eq.$2"
    [[ -n "${3:-}" ]] && FILTER="$FILTER&status=eq.$3"
    curl -s "$BASE/content_items?select=id,client_id,content_type,status,title,due_date&order=created_at.desc&limit=50$FILTER" \
      -H "$AUTH" -H "$KEY" | python3 -m json.tool
    ;;

  # --- Generation Jobs ---

  start-job)
    # Usage: cc.sh start-job '{"client_id":"...","job_type":"monthly_social","config":{...}}'
    curl -s -X POST "$BASE/generation_jobs" \
      -H "$AUTH" -H "$KEY" -H "$JSON" -H "Prefer: return=representation" \
      -d "$2" | python3 -m json.tool
    ;;

  complete-job)
    # Usage: cc.sh complete-job <job_id> <items_created>
    curl -s -X PATCH "$BASE/generation_jobs?id=eq.${2}" \
      -H "$AUTH" -H "$KEY" -H "$JSON" \
      -d "{\"status\":\"completed\",\"items_created\":${3},\"completed_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}"
    ;;

  fail-job)
    # Usage: cc.sh fail-job <job_id> "error message"
    curl -s -X PATCH "$BASE/generation_jobs?id=eq.${2}" \
      -H "$AUTH" -H "$KEY" -H "$JSON" \
      -d "{\"status\":\"failed\",\"error_message\":\"${3}\"}"
    ;;

  # --- Image Upload ---

  upload-image)
    # Usage: cc.sh upload-image <local_path> <storage_path>
    # e.g.: cc.sh upload-image /tmp/hero.jpg "complete-chiropractic/social-001.jpg"
    curl -s -X POST "$STORAGE/object/content-images/${3}" \
      -H "$AUTH" -H "$KEY" \
      -H "Content-Type: image/jpeg" \
      --data-binary "@${2}" \
      | python3 -m json.tool
    echo ""
    echo "Public URL: $CC_SUPABASE_URL/storage/v1/object/public/content-images/${3}"
    ;;

  # --- Help ---

  help|*)
    cat <<HELP
MCH Studio CLI

Clients:
  list-clients                          List all clients
  get-client <slug>                     Get client by slug
  get-profile <client_id>              Get client AI profile
  add-client '{...}'                    Add a new client
  add-profile '{...}'                   Add client AI profile
  update-client <slug> '{...}'          Update client fields

Content:
  push-content '{...}'                  Push one content item
  push-batch '[{...},...]'              Push multiple content items
  list-content [client_id] [status]     List content items

Jobs:
  start-job '{...}'                     Log a generation job
  complete-job <job_id> <count>         Mark job complete
  fail-job <job_id> "message"           Mark job failed

Images:
  upload-image <local_path> <storage_path>   Upload image to Supabase Storage
HELP
    ;;
esac
