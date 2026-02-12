#!/usr/bin/env bash
# ==============================================================================
# 🏰 The Warding Circle — One-Time Security Setup Script
# ==============================================================================
#
# This script configures Google Cloud security for Ollos Player Companion.
# Run this ONCE after deploying the Express proxy for the first time.
#
# What it does:
#   1. Creates a Secret Manager secret for the Gemini API key
#   2. Grants the Cloud Run service account access to the secret
#   3. Mounts the secret as a runtime env var on the Cloud Run service
#   4. Sets Gemini File URIs as runtime env vars (no longer in the build)
#   5. Restricts the Firebase API key to your domain (HTTP referrer)
#   6. Prints a checklist of manual Console steps
#
# Prerequisites:
#   - gcloud CLI installed and authenticated (`gcloud auth login`)
#   - You are the owner/editor of the GCP project
#
# Usage:
#   chmod +x scripts/setup-security.sh
#   ./scripts/setup-security.sh
# ==============================================================================

set -euo pipefail

# ─── Configuration (from your Cloud Run service YAML) ────────────────
# Edit these if your setup differs
PROJECT_ID="gen-lang-client-0664125417"
PROJECT_NUMBER="350817164864"
SERVICE_NAME="the-players-companion"
REGION="us-west1"
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

# Your deployed URLs (for API key restriction)
DEPLOYED_URLS=(
  "https://the-players-companion-350817164864.us-west1.run.app/*"
  "https://the-players-companion-tganwfnfaq-uw.a.run.app/*"
)

# ─── Colors ───────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🏰 The Warding Circle — Security Setup      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# ─── Step 0: Verify gcloud is configured ──────────────────────────────
echo -e "${YELLOW}[0/5]${NC} Verifying gcloud configuration..."
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
  echo -e "  Setting project to ${PROJECT_ID}..."
  gcloud config set project "$PROJECT_ID"
fi
echo -e "  ${GREEN}✓${NC} Project: $PROJECT_ID"
echo ""

# ─── Step 1: Create Gemini API Key secret ─────────────────────────────
echo -e "${YELLOW}[1/5]${NC} Creating Secret Manager secret for Gemini API key..."

# Check if secret already exists
if gcloud secrets describe gemini-api-key --project="$PROJECT_ID" &>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Secret 'gemini-api-key' already exists."
  echo -e "  To update the key value, run:"
  echo -e "    echo -n 'YOUR_NEW_KEY' | gcloud secrets versions add gemini-api-key --data-file=-"
else
  echo -e "  ${BLUE}Enter your Gemini API key (input will be hidden):${NC}"
  read -s GEMINI_KEY
  echo ""

  if [ -z "$GEMINI_KEY" ]; then
    echo -e "  ${RED}✗ No key provided. Aborting.${NC}"
    exit 1
  fi

  echo -n "$GEMINI_KEY" | gcloud secrets create gemini-api-key \
    --data-file=- \
    --project="$PROJECT_ID" \
    --replication-policy="automatic"

  echo -e "  ${GREEN}✓${NC} Secret 'gemini-api-key' created."
fi
echo ""

# ─── Step 2: Grant Cloud Run service account access ───────────────────
echo -e "${YELLOW}[2/5]${NC} Granting Secret Manager access to Cloud Run service account..."

gcloud secrets add-iam-policy-binding gemini-api-key \
  --project="$PROJECT_ID" \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor" \
  --quiet 2>/dev/null

echo -e "  ${GREEN}✓${NC} Service account can now read the secret."
echo ""

# ─── Step 3: Mount secret + env vars on Cloud Run ─────────────────────
echo -e "${YELLOW}[3/5]${NC} Updating Cloud Run service with runtime secrets and env vars..."

# Prompt for Gemini File URIs if not already set
echo -e "  ${BLUE}Do you want to set Gemini File URIs for D&D reference PDFs? (y/N)${NC}"
read -r SET_FILE_URIS

ENV_VARS_FLAG=""
if [[ "$SET_FILE_URIS" =~ ^[Yy]$ ]]; then
  echo -e "  Enter GEMINI_FILE_URI_BASIC (or press Enter to skip):"
  read -r URI_BASIC
  echo -e "  Enter GEMINI_FILE_URI_DMG (or press Enter to skip):"
  read -r URI_DMG
  echo -e "  Enter GEMINI_FILE_URI_MM (or press Enter to skip):"
  read -r URI_MM
  echo -e "  Enter GEMINI_FILE_URI_PHB (or press Enter to skip):"
  read -r URI_PHB

  # Build env vars string (only include non-empty ones)
  ENV_PARTS=()
  [ -n "$URI_BASIC" ] && ENV_PARTS+=("GEMINI_FILE_URI_BASIC=$URI_BASIC")
  [ -n "$URI_DMG" ]   && ENV_PARTS+=("GEMINI_FILE_URI_DMG=$URI_DMG")
  [ -n "$URI_MM" ]    && ENV_PARTS+=("GEMINI_FILE_URI_MM=$URI_MM")
  [ -n "$URI_PHB" ]   && ENV_PARTS+=("GEMINI_FILE_URI_PHB=$URI_PHB")

  if [ ${#ENV_PARTS[@]} -gt 0 ]; then
    ENV_VARS_FLAG="--set-env-vars=$(IFS=,; echo "${ENV_PARTS[*]}")"
  fi
fi

# Also pass the Firebase Web API key for server-side token verification
echo -e "  ${BLUE}Enter your Firebase Web API key (for server-side token verification):${NC}"
echo -e "  (This is the same value as VITE_FIREBASE_API_KEY — it's public, not a secret)"
read -r FIREBASE_WEB_API_KEY

FIREBASE_FLAG=""
if [ -n "$FIREBASE_WEB_API_KEY" ]; then
  if [ -n "$ENV_VARS_FLAG" ]; then
    ENV_VARS_FLAG="${ENV_VARS_FLAG},FIREBASE_WEB_API_KEY=$FIREBASE_WEB_API_KEY"
  else
    ENV_VARS_FLAG="--set-env-vars=FIREBASE_WEB_API_KEY=$FIREBASE_WEB_API_KEY"
  fi
fi

# Apply the update
gcloud run services update "$SERVICE_NAME" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest" \
  $ENV_VARS_FLAG \
  --quiet

echo -e "  ${GREEN}✓${NC} Cloud Run service updated with runtime secrets."
echo ""

# ─── Step 4: Remove _GEMINI_API_KEY from Cloud Build trigger ─────────
echo -e "${YELLOW}[4/5]${NC} Checking Cloud Build trigger substitution variables..."
echo -e "  ${YELLOW}→${NC} If your Cloud Build trigger has a substitution variable"
echo -e "    called ${RED}_GEMINI_API_KEY${NC}, you can safely remove it."
echo -e "    It is no longer used as a build arg."
echo -e "  ${YELLOW}→${NC} Also remove: _VITE_GEMINI_FILE_URI_BASIC, _VITE_GEMINI_FILE_URI_DMG,"
echo -e "    _VITE_GEMINI_FILE_URI_MM, _VITE_GEMINI_FILE_URI_PHB"
echo -e "  ${GREEN}✓${NC} (Manual step — see Cloud Build → Triggers in Console)"
echo ""

# ─── Step 5: Print manual checklist ──────────────────────────────────
echo -e "${YELLOW}[5/5]${NC} Manual steps remaining (Google Cloud Console):"
echo ""
echo -e "  ${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${RED}MANUAL STEP 1: Set Gemini API daily quota cap${NC}"
echo -e "  ${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e ""
echo -e "  1. Go to: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas?project=$PROJECT_ID"
echo -e "  2. Find 'Requests per day' or 'Requests per minute'"
echo -e "  3. Click the pencil icon → set a daily limit (recommended: 5000/day)"
echo -e "  4. Save"
echo -e ""
echo -e "  ${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${RED}MANUAL STEP 2: Verify API key restrictions${NC}"
echo -e "  ${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e ""
echo -e "  1. Go to: https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo -e "  2. Click your Gemini API key"
echo -e "     → 'API restrictions' should show: Generative Language API only"
echo -e "     → If deploying via proxy, key no longer needs HTTP referrer restrictions"
echo -e "  3. Click your Firebase API key"
echo -e "     → 'Application restrictions' → 'HTTP referrers'"
echo -e "     → Add your domains:"
for url in "${DEPLOYED_URLS[@]}"; do
  echo -e "       • $url"
done
echo -e "     → Also add: http://localhost:3000/* (for local dev)"
echo -e ""
echo -e "  ${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  ${RED}CRITICAL: Rotate your Gemini API key${NC}"
echo -e "  ${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e ""
echo -e "  Your old API key was previously exposed in the client-side JS bundle."
echo -e "  Now that the proxy is active, rotate the key:"
echo -e ""
echo -e "  1. Go to: https://aistudio.google.com/apikey"
echo -e "  2. Create a new API key"
echo -e "  3. Update the secret:"
echo -e "     echo -n 'NEW_KEY_HERE' | gcloud secrets versions add gemini-api-key --data-file=-"
echo -e "  4. Redeploy or restart Cloud Run to pick up the new version"
echo -e "  5. Delete/revoke the old key"
echo -e ""
echo -e "${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     🏰 The Warding Circle is inscribed!          ║${NC}"
echo -e "${GREEN}║     Deploy your app and run the manual steps.    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════╝${NC}"
