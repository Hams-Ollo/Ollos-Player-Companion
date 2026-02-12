# ⚜️ The Planar Gate Manual — Cloud Run Deployment ⚜️

> *"To transport Ollo's Player Companion from the Material Plane  
> to the Ethereal Plane of Google Cloud, one must follow  
> the ancient deployment ritual precisely."*
>
> Complete guide to deploying the application on Google Cloud Run  
> with Firebase Authentication and Firestore persistence.

---

## Chapter 1: Prerequisites

> *"Before you can open a Planar Gate, you must gather these components."*

- [ ] **Google Cloud account** with billing enabled
- [ ] **Google Cloud CLI** (`gcloud`) installed and authenticated
- [ ] **Firebase CLI** (`firebase-tools`) installed globally
- [ ] **Docker** (optional — only needed for Option B manual builds)
- [ ] **Node.js 18+** and npm

```bash
# Verify your arcane toolkit
gcloud --version
firebase --version
node --version
```

---

## Chapter 2: The Ritual Circle — Google Cloud Project Setup

> *"Draw the circle carefully. A misplaced rune will doom the ritual."*

### Step 1: Create the Project

```bash
# Create a new Google Cloud project (or use existing)
gcloud projects create YOUR_PROJECT_ID --name="The Players Companion"

# Set it as your active project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs — the three pillars of the Gate
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

### Step 2: Set the Region

```bash
# Choose your deployment region (where the Gate opens)
gcloud config set run/region us-central1
```

---

## Chapter 3: The Sacred Flame — Firebase Configuration

> *"Firebase provides the sacred flame that authenticates worthy adventurers  
> and stores their heroic deeds."*

### Step 1: Create Firebase Project

1. Visit the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** → select your Google Cloud project
3. Enable **Google Analytics** (optional)
4. Wait for provisioning to complete

### Step 2: Enable Authentication

1. Navigate to **Authentication** → **Sign-in method**
2. Enable **Google** sign-in provider
3. Enable **Anonymous** sign-in (for guest adventurers)
4. Note your **Project ID** and **Web API Key**

### Step 3: Create Firestore Database

1. Navigate to **Firestore Database** → **Create database**
2. Select **Production mode**
3. Choose the same region as your Cloud Run service
4. Deploy security rules:

```bash
firebase deploy --only firestore:rules --project YOUR_PROJECT_ID
```

### Step 4: Register Web App

1. In Firebase Console → **Project Settings** → **General**
2. Under "Your apps", click **Add app** → **Web** (</> icon)
3. Register with name "The Players Companion"
4. Copy the config values — you'll need them for environment variables

### Step 5: Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key for your project
3. Guard this key as you would a dragon's hoard

### Step 6: Store the Key in Secret Manager

> *"A key left in the open is an invitation to thieves. Seal it within the Vault."*

```bash
# Enable the Secret Manager API
gcloud services enable secretmanager.googleapis.com

# Create the secret
printf "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=-

# Grant Cloud Run access to read the secret
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:$(gcloud iam service-accounts list --format='value(email)' --filter='displayName:Compute Engine default')" \
  --role="roles/secretmanager.secretAccessor"
```

> ⚠️ **Never** pass `GEMINI_API_KEY` as a build arg or plain env var. It must be injected from Secret Manager at runtime.

---

## Chapter 4: Opening the Gate — Deploy to Cloud Run

> *"The incantation is spoken. The gate shimmers into being."*

### Option A: Source Deploy (Recommended)

> *"The simplest path — Cloud Build handles the construction for you."*

```bash
# Deploy with Firebase config as build-time env vars
# and Gemini API key from Secret Manager (runtime only)
gcloud run deploy the-players-companion \
  --source . \
  --region us-west1 \
  --allow-unauthenticated \
  --set-env-vars "\
VITE_FIREBASE_API_KEY=your-firebase-api-key,\
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com,\
VITE_FIREBASE_PROJECT_ID=your-project-id,\
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app,\
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id,\
VITE_FIREBASE_APP_ID=your-app-id" \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest"
```

Cloud Build will:
1. Detect the `Dockerfile`
2. Build the container image (Stage 1: Vite build, Stage 2: Express server)
3. Push to Artifact Registry
4. Deploy to Cloud Run with the secret mounted
5. Return a service URL

### Option B: Manual Docker Build

> *"For those who prefer to forge the container themselves."*

```bash
# Step 1: Build the image locally
# Note: Only VITE_* vars are build args (baked into the SPA)
docker build \
  --build-arg VITE_FIREBASE_API_KEY=your-firebase-api-key \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com \
  --build-arg VITE_FIREBASE_PROJECT_ID=your-project-id \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id \
  --build-arg VITE_FIREBASE_APP_ID=your-app-id \
  -t gcr.io/YOUR_PROJECT_ID/the-players-companion .

# Step 2: Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/the-players-companion

# Step 3: Deploy to Cloud Run with secret
gcloud run deploy the-players-companion \
  --image gcr.io/YOUR_PROJECT_ID/the-players-companion \
  --region us-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest"
```

---

## Chapter 5: The Auth Domain Ward

> *"Firebase Auth requires that your service URL be registered  
> as an authorized domain — lest the Gate reject worthy visitors."*

### Add Cloud Run URL to Authorized Domains

1. Copy your Cloud Run service URL (e.g., `https://ollos-player-companion-xxxxx-uc.a.run.app`)
2. Go to **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**
3. Click **"Add domain"**
4. Paste just the domain: `ollos-player-companion-xxxxx-uc.a.run.app`

> ⚠️ **Critical:** Without this step, Google sign-in will fail with `auth/unauthorized-domain`. The most common cause of "the gate won't open" reports.

---

## Chapter 6: Verification — Testing the Gate

> *"Never trust. Always verify."*

```bash
# Check the service is running
gcloud run services describe ollos-player-companion \
  --region us-central1 \
  --format "value(status.url)"

# Quick smoke test
curl -s -o /dev/null -w "%{http_code}" https://YOUR_SERVICE_URL
# Should return: 200
```

### Manual Verification Checklist

- [ ] App loads at the Cloud Run URL
- [ ] Google sign-in works (no `auth/unauthorized-domain` error)
- [ ] Anonymous/guest mode works
- [ ] Characters save to Firestore (check Firebase Console → Firestore)
- [ ] AI features work (ask the DM a question)
- [ ] Portrait generation works
- [ ] Campaign creation/joining works
- [ ] DM can see DM Dashboard with party overview
- [ ] Invite flow works (join code sharing + email invites)
- [ ] Character assignment to campaigns works

---

## Chapter 7: Updating the Deployment

> *"The Gate must be refreshed when new enchantments are added."*

### Redeploy with Source Deploy

```bash
# Same command — Cloud Build detects changes and rebuilds
gcloud run deploy the-players-companion \
  --source . \
  --region us-west1 \
  --allow-unauthenticated
```

### Update Environment Variables Only

```bash
gcloud run services update the-players-companion \
  --region us-west1 \
  --set-env-vars "SOME_VAR=new-value"
```

### Rotate the Gemini API Key

```bash
# Add a new secret version
printf "NEW_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-

# Redeploy to pick up the latest version
gcloud run services update the-players-companion --region us-west1
```

### Update Firestore Rules Only

```bash
firebase deploy --only firestore:rules --project YOUR_PROJECT_ID
```

### View Deployment Logs

```bash
# Stream logs in real-time
gcloud run services logs read ollos-player-companion \
  --region us-central1 \
  --limit 50

# Or tail live
gcloud run services logs tail ollos-player-companion \
  --region us-central1
```

---

## Chapter 8: Custom Domain — Name Your Realm

> *"Every great realm deserves a proper name."*

```bash
# Map a custom domain to your Cloud Run service
gcloud run domain-mappings create \
  --service ollos-player-companion \
  --domain your-domain.com \
  --region us-central1
```

Then add the DNS records shown in the output to your domain registrar. Remember to also add the custom domain to Firebase Auth's authorized domains list.

---

## Chapter 9: Troubleshooting — The Sage's Wisdom

> *"When the gate falters, consult the sage."*

### "Build failed" during deployment

```bash
# Check Cloud Build logs
gcloud builds list --limit 5
gcloud builds log BUILD_ID
```

**Common causes:**
- Missing `package-lock.json` (run `npm install` locally first)
- Node version mismatch (Dockerfile uses Node 18)
- TypeScript errors (run `npm run build` locally to check)

### "auth/unauthorized-domain" on sign-in

1. Check Firebase Console → Authentication → Settings → Authorized domains
2. Ensure your Cloud Run domain is listed (without `https://`)
3. Wait 1–2 minutes for propagation after adding

### App loads but shows blank page

```bash
# Check container logs
gcloud run services logs read the-players-companion --limit 20
```

**Common causes:**
- Missing environment variables (all `VITE_*` vars must be set at **build time**)
- Express server crash (check logs for startup errors)

### AI features return errors

- Verify the `gemini-api-key` secret exists: `gcloud secrets versions list gemini-api-key`
- Check the API key is enabled for the Gemini API in Google AI Studio
- Check proxy health: `curl https://YOUR_SERVICE_URL/api/health`
- Ensure rate limiting isn't blocking requests (20/user/min, 200 global/min)

### Characters not saving

- Verify Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Check the user is authenticated (not a guest trying to use cloud features)
- Look for document size warnings in browser console (>800KB)

### Container crashes on startup

```bash
# Check for port binding issues
gcloud run services describe ollos-player-companion \
  --format "value(spec.template.spec.containers[0].ports[0].containerPort)"
# Should be 8080
```

---

## Chapter 10: Architecture Overview

> *"A map of the ethereal infrastructure."*

```
┌─────────────────┐     ┌────────────────────────────┐     ┌───────────────────┐
│                 │     │   Cloud Run                │     │                   │
│   Browser       │────▶│   (Express Server)         │────▶│   Google AI       │
│   (React SPA)   │     │                            │     │   (Gemini API)    │
│                 │     │   • Serves static dist/     │     │                   │
└────────┬────────┘     │   • Proxies /api/gemini/* │     └───────────────────┘
         │              │   • Auth middleware       │
         │              │   • Rate limiting         │     ┌───────────────────┐
         │              └────────────────────────────┘     │                   │
         │                                                │   Firebase        │
         │  Firebase SDK (Auth + Firestore)               │   • Auth          │
         └───────────────────────────────────────────────▶│   • Firestore    │
                                                          │                   │
         ┌────────────────────────────┐                   └───────────────────┘
         │  GCP Secret Manager          │
         │  • gemini-api-key → Express  │
         └────────────────────────────┘
```

**Key architectural notes:**
- Cloud Run runs an **Express server** (`server/index.js`) that serves the static Vite SPA and proxies AI requests.
- **`GEMINI_API_KEY`** is stored in **Google Cloud Secret Manager** and injected as a runtime env var. It **never** appears in the client bundle or build args.
- All Gemini API calls are routed through the Express proxy (`/api/gemini/*`) with Firebase token authentication and rate limiting.
- `VITE_*` environment variables are baked into the client JS bundle at build time — changing them requires a redeploy.
- Firebase Auth and Firestore calls still happen **client-side** from the browser via the Firebase JS SDK.

---

## Chapter 11: Cost Estimate

> *"Even adventurers must manage their gold."*

| Service | Free Tier | Estimated Monthly Cost |
|:--------|:----------|:----------------------|
| Cloud Run | 2M requests/month, 360K vCPU-seconds | **$0** for hobby use |
| Cloud Build | 120 build-minutes/day | **$0** for most projects |
| Artifact Registry | 0.5 GB storage free | **$0** unless many images |
| Secret Manager | 6 active versions, 10K access ops | **$0** for hobby use |
| Firebase Auth | 10K verifications/month | **$0** for hobby use |
| Firestore | 1 GiB storage, 50K reads/day, 20K writes/day | **$0** for small parties |
| Gemini API | Free tier with rate limits | **$0** with free API key |
| **Total** | | **$0/month** for typical hobby use |

> 💡 **Adventurer's Tip:** The entire stack runs within free tiers for a typical D&D group (4–6 players). Costs only arise at scale (thousands of concurrent users).

---

<p align="center"><em>⚔️ The Gate stands open. Your realm awaits beyond. ⚔️</em></p>
