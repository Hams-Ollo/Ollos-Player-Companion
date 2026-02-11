# Vesper — Cloud Run Deployment Guide

A step-by-step guide to deploy **The Player's Companion (Vesper)** to Google Cloud Run.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Google Cloud Project Setup](#2-google-cloud-project-setup)
3. [Firebase Configuration](#3-firebase-configuration)
4. [Deploy to Cloud Run](#4-deploy-to-cloud-run)
   - [Option A: One-Command Source Deploy (Recommended)](#option-a-one-command-source-deploy-recommended)
   - [Option B: Manual Docker Build + Deploy](#option-b-manual-docker-build--deploy)
5. [Configure Firebase Auth for Your Cloud Run Domain](#5-configure-firebase-auth-for-your-cloud-run-domain)
6. [Verify the Deployment](#6-verify-the-deployment)
7. [Updating the App](#7-updating-the-app)
8. [Custom Domain (Optional)](#8-custom-domain-optional)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

Before you begin, make sure you have the following installed and ready:

| Tool | Purpose | Install Link |
|------|---------|-------------|
| **Google Cloud SDK (`gcloud`)** | CLI to deploy to Cloud Run | https://cloud.google.com/sdk/docs/install |
| **Node.js 20+** | Build the app locally (optional) | https://nodejs.org/ |
| **Docker** (optional) | For local container testing | https://docs.docker.com/get-docker/ |
| **A Google Cloud account** | Billing enabled | https://console.cloud.google.com/ |
| **A Firebase project** | Authentication | https://console.firebase.google.com/ |

### Gather your secrets

You'll need these values from your `.env` file. Have them ready:

```
GEMINI_API_KEY=your-gemini-api-key
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 2. Google Cloud Project Setup

### 2.1 Authenticate with Google Cloud

```bash
gcloud auth login
```

### 2.2 Create or select a project

```bash
# Create a new project (or skip if you already have one)
gcloud projects create vesper-dnd --name="Vesper D&D"

# Set it as the active project
gcloud config set project vesper-dnd
```

> Replace `vesper-dnd` with your preferred project ID throughout this guide.

### 2.3 Enable billing

Billing must be enabled for Cloud Run. Go to:
https://console.cloud.google.com/billing/linkedaccount

### 2.4 Enable required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

### 2.5 Set your default region

```bash
gcloud config set run/region us-west1
```

> Choose a region close to your users. Common options: `us-central1`, `us-west1`, `us-east1`, `europe-west1`.

---

## 3. Firebase Configuration

If you haven't already set up Firebase:

### 3.1 Create a Firebase project

1. Go to https://console.firebase.google.com/
2. Click **Add project**
3. Select your existing Google Cloud project (`vesper-dnd`) or create a new one
4. Follow the setup wizard

### 3.2 Register a web app

1. In the Firebase console, click the **Web** icon (`</>`) to add a web app
2. Give it a nickname (e.g., "Vesper Web")
3. Copy the Firebase config values — you'll need them for deployment

### 3.3 Enable Authentication providers

1. Go to **Authentication** > **Sign-in method**
2. Enable **Google** sign-in
3. Enable **Anonymous** sign-in
4. Click **Save**

### 3.4 Add your Cloud Run domain to authorized domains

> **This step is critical!** Without it, Google sign-in will fail on your deployed app.

1. Go to **Authentication** > **Settings** > **Authorized domains**
2. After deploying (Step 4), add your Cloud Run service URL:
   ```
   the-players-companion-XXXXXXXXXX-uw.a.run.app
   ```
   (You'll get this URL after deployment — come back to add it)

---

## 4. Deploy to Cloud Run

### Option A: One-Command Source Deploy (Recommended)

This is the simplest approach. Cloud Run detects your `Dockerfile`, builds the container in the cloud using Cloud Build, and deploys it — all in one command.

```bash
gcloud run deploy the-players-companion \
  --source . \
  --region us-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-build-env-vars="GEMINI_API_KEY=YOUR_GEMINI_KEY,VITE_FIREBASE_API_KEY=YOUR_FB_API_KEY,VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com,VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID,VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.firebasestorage.app,VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID,VITE_FIREBASE_APP_ID=YOUR_APP_ID"
```

> **Important**: Replace every `YOUR_*` placeholder with your actual values.

**What happens behind the scenes:**
1. Your source code is uploaded to Cloud Build
2. Cloud Build finds the `Dockerfile` and builds the container
3. The `--set-build-env-vars` flag passes your secrets as build-time environment variables (Vite bakes them into the JS bundle during `npm run build`)
4. The built container image is pushed to Artifact Registry
5. Cloud Run deploys the container and gives you a URL

**If values contain commas**, use the `^@^` delimiter syntax:
```bash
gcloud run deploy the-players-companion \
  --source . \
  --region us-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-build-env-vars="^@^GEMINI_API_KEY=YOUR_KEY@VITE_FIREBASE_API_KEY=YOUR_KEY@VITE_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN"
```

### Option B: Manual Docker Build + Deploy

Use this if you want more control, or if you want to test locally first.

#### Step 1: Create an Artifact Registry repository (one-time)

```bash
gcloud artifacts repositories create vesper-repo \
  --repository-format=docker \
  --location=us-west1 \
  --description="Vesper container images"
```

#### Step 2: Configure Docker authentication

```bash
gcloud auth configure-docker us-west1-docker.pkg.dev
```

#### Step 3: Build the Docker image

```bash
docker build \
  --build-arg GEMINI_API_KEY="YOUR_GEMINI_KEY" \
  --build-arg VITE_FIREBASE_API_KEY="YOUR_FB_API_KEY" \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN="YOUR_PROJECT.firebaseapp.com" \
  --build-arg VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID" \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET="YOUR_PROJECT.firebasestorage.app" \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_SENDER_ID" \
  --build-arg VITE_FIREBASE_APP_ID="YOUR_APP_ID" \
  -t us-west1-docker.pkg.dev/vesper-dnd/vesper-repo/vesper:latest \
  .
```

> **Mac with Apple Silicon?** Add `--platform linux/amd64` to the command.

#### Step 4: (Optional) Test locally

```bash
docker run -p 8080:8080 us-west1-docker.pkg.dev/vesper-dnd/vesper-repo/vesper:latest
```

Open http://localhost:8080 — you should see the Vesper login screen.

#### Step 5: Push to Artifact Registry

```bash
docker push us-west1-docker.pkg.dev/vesper-dnd/vesper-repo/vesper:latest
```

#### Step 6: Deploy to Cloud Run

```bash
gcloud run deploy the-players-companion \
  --image us-west1-docker.pkg.dev/vesper-dnd/vesper-repo/vesper:latest \
  --region us-west1 \
  --allow-unauthenticated \
  --port 8080
```

---

## 5. Configure Firebase Auth for Your Cloud Run Domain

After deployment, Cloud Run prints a service URL like:

```
Service URL: https://the-players-companion-abcdef123-uw.a.run.app
```

**You must add this domain to Firebase:**

1. Go to [Firebase Console](https://console.firebase.google.com/) > **Authentication** > **Settings**
2. Under **Authorized domains**, click **Add domain**
3. Add the domain portion (without `https://`):
   ```
   the-players-companion-abcdef123-uw.a.run.app
   ```
4. Click **Add**

Without this step, the "Enter with Google" button will fail with an `auth/unauthorized-domain` error.

---

## 6. Verify the Deployment

1. Open the Cloud Run service URL in your browser
2. You should see the Vesper login screen (crown logo, "Enter with Google" button)
3. Try signing in with Google or as a Guest Adventurer
4. Verify character creation and AI features work

### Quick verification via CLI

```bash
# Check the service is running
gcloud run services describe the-players-companion --region us-west1

# Get the URL
gcloud run services describe the-players-companion --region us-west1 --format='value(status.url)'

# Check logs if something is wrong
gcloud run services logs read the-players-companion --region us-west1 --limit 50
```

---

## 7. Updating the App

After making code changes, redeploy with the same command:

### Source deploy (Option A)

```bash
gcloud run deploy the-players-companion \
  --source . \
  --region us-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-build-env-vars="GEMINI_API_KEY=YOUR_KEY,VITE_FIREBASE_API_KEY=YOUR_KEY,VITE_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN,VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT,VITE_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET,VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_ID,VITE_FIREBASE_APP_ID=YOUR_APP_ID"
```

### Docker deploy (Option B)

```bash
docker build --build-arg GEMINI_API_KEY="..." ... -t us-west1-docker.pkg.dev/vesper-dnd/vesper-repo/vesper:latest .
docker push us-west1-docker.pkg.dev/vesper-dnd/vesper-repo/vesper:latest
gcloud run deploy the-players-companion \
  --image us-west1-docker.pkg.dev/vesper-dnd/vesper-repo/vesper:latest \
  --region us-west1
```

---

## 8. Custom Domain (Optional)

To use a custom domain like `vesper.yourdomain.com`:

```bash
# Map your domain
gcloud run domain-mappings create \
  --service the-players-companion \
  --domain vesper.yourdomain.com \
  --region us-west1
```

Then add the DNS records shown in the output to your domain registrar. Don't forget to also add `vesper.yourdomain.com` to Firebase's **Authorized domains** list.

---

## 9. Troubleshooting

### Black screen after deploy

| Cause | Fix |
|-------|-----|
| Missing build-time env vars | Redeploy with `--set-build-env-vars` (all `VITE_*` and `GEMINI_API_KEY`) |
| Old import map in `index.html` | Make sure the `<script type="importmap">` block has been removed |
| No Dockerfile | Confirm `Dockerfile` and `nginx.conf` exist in your repo root |
| Wrong port | Cloud Run defaults to port 8080; our nginx config listens on 8080 |

### Google sign-in fails with `auth/unauthorized-domain`

Add your Cloud Run domain to Firebase Authentication > Settings > Authorized domains (see [Step 5](#5-configure-firebase-auth-for-your-cloud-run-domain)).

### "Container failed to start" in Cloud Run logs

```bash
gcloud run services logs read the-players-companion --region us-west1 --limit 50
```

Usually means the container isn't listening on port 8080. Our nginx config handles this.

### Build fails in Cloud Build

Check build logs:
```bash
gcloud builds list --limit 5
gcloud builds log BUILD_ID
```

Common issues:
- Missing `package-lock.json` (needed by `npm ci`)
- Node version mismatch

### Gemini AI not working

The Gemini API key is baked into the JS bundle at build time. If you changed the key, you must **rebuild and redeploy** — you can't just update a runtime env var.

---

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  Your Code  │────>│  Cloud Build │────>│  Artifact     │
│  (Source)    │     │  (Dockerfile)│     │  Registry     │
└─────────────┘     └──────────────┘     └───────┬───────┘
                                                  │
                                                  ▼
                                         ┌───────────────┐
                                         │   Cloud Run   │
                                         │   (nginx +    │
                                         │    static     │
                                         │    files)     │
                                         └───────┬───────┘
                                                  │
                                    ┌─────────────┼─────────────┐
                                    ▼             ▼             ▼
                              ┌──────────┐ ┌──────────┐ ┌────────────┐
                              │ Firebase │ │ Gemini   │ │  Browser   │
                              │   Auth   │ │   API    │ │ (User)     │
                              └──────────┘ └──────────┘ └────────────┘
```

- **Cloud Build** reads your `Dockerfile`, runs `npm ci && npm run build`, and packages the output into a container
- **nginx** serves the static Vite build output on port 8080
- **Firebase Auth** handles Google/Anonymous sign-in (client-side)
- **Gemini API** is called directly from the browser (API key is in the JS bundle)

---

## Cost Estimate

Cloud Run has a generous free tier:
- **2 million requests/month** free
- **360,000 vCPU-seconds/month** free
- **1 GiB outbound data/month** free

For a personal D&D companion app, you'll likely stay within the free tier. See [Cloud Run Pricing](https://cloud.google.com/run/pricing) for details.
