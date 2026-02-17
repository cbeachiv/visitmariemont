# Visit Mariemont — Setup Guide

## 1. Create a Firebase Project (Free)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `visitmariemont` → create
3. In the left sidebar, click **Firestore Database** → **Create database** → choose **Production mode** → pick a region (e.g. `us-east1`) → Done

## 2. Get Your Firebase Credentials

1. In Firebase Console → **Project Settings** (gear icon) → **Service Accounts** tab
2. Click **Generate new private key** → Download the JSON file
3. Open the JSON file — you need these three values:
   - `project_id`
   - `client_email`
   - `private_key` (the long one that starts with `-----BEGIN PRIVATE KEY-----`)

## 3. Configure Environment Variables

Edit `.env` and fill in your values:

```bash
# From the service account JSON:
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Generate a secret: run this in terminal:
# openssl rand -base64 32
NEXTAUTH_SECRET="paste-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Your email (where survey notifications go) and admin password:
ADMIN_EMAIL="your@email.com"
ADMIN_PASSWORD="choose-a-strong-password"

# Get a free API key at resend.com (optional — for email notifications):
RESEND_API_KEY="re_your_api_key_here"
```

> **Note on the private key:** Copy the entire `private_key` value from the JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts. Keep the `\n` characters exactly as they are — don't replace them with actual newlines in the `.env` file.

## 4. Seed the Database with Mariemont Places

Install ts-node if you haven't:
```bash
npm install -D ts-node
```

Then run the seed script:
```bash
npm run db:seed
```

This adds 18 Mariemont places to Firestore (restaurants, coffee spots, trails, fitness, culture).

## 5. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000`

## 6. Admin Access

Go to `http://localhost:3000/admin` — log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`.

## 7. Test the Full Flow

1. Log into admin → Add a test guest (yourself!) with arrival/departure dates
2. Go to `http://localhost:3000/visit` → Enter your name → Fill out the survey
3. Check your admin email — you should get a notification (if Resend is configured)
4. Go to `/admin/guests/[id]` → Review the auto-generated itinerary
5. Add some jokes and fines to event notes (e.g. `$5 fine for waking up after 9am`)
6. Hit **Publish Itinerary**
7. Go to `/visit/your-name` — view your itinerary!

---

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add all `.env` variables in **Vercel → Project → Settings → Environment Variables**
   - For `FIREBASE_PRIVATE_KEY`, paste the full key including `\n` characters
4. Change `NEXTAUTH_URL` to your production domain (e.g. `https://visitmariemont.com`)
5. Deploy!

---

## Email Notifications (optional)

1. Sign up at [resend.com](https://resend.com) — free for 100 emails/day
2. Add a sending domain in Resend (your domain, or use their sandbox for testing)
3. Get your API key and add it to `.env` as `RESEND_API_KEY`

---

## Domain

Purchase `visitmariemont.com` and connect to Vercel in your project's **Domains** settings.
