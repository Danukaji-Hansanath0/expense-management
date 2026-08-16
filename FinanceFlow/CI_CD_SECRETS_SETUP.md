# FinanceFlow CI/CD Secrets Configuration

## 🔐 Required GitHub Repository Secrets

Add these secrets in your GitHub repository under **Settings → Secrets and variables → Actions**:

### 1. Expo/EAS Build Secrets (Required)

| Secret Name | Description | How to Obtain |
|-------------|-------------|---------------|
| `EXPO_TOKEN` | Expo access token for EAS builds | 1. Go to https://expo.dev/settings/access-tokens<br>2. Click "Create Access Token"<br>3. Give it a name (e.g., "FinanceFlow CI")<br>4. Copy the generated token |

### 2. Firebase Configuration Secrets (Required)

Get these from **Firebase Console** → Your Project → **Project Settings** → **General** → **Your apps** → **SDK setup and configuration**:

| Secret Name | Example Value | Description |
|-------------|---------------|-------------|
| `FB_API_KEY` | `AIzaSyDxxxxxxxxxxxxx` | Firebase API Key |
| `FB_AUTH_DOMAIN` | `financeflow-prod.firebaseapp.com` | Firebase Auth Domain |
| `FB_PROJECT_ID` | `financeflow-prod` | Firebase Project ID |
| `FB_STORAGE_BUCKET` | `financeflow-prod.appspot.com` | Firebase Storage Bucket |
| `FB_MESSAGING_SENDER_ID` | `123456789012` | Firebase Messaging Sender ID |
| `FB_APP_ID` | `1:123456789012:android:abc123` | Firebase App ID |

### 3. Google Authentication Secrets (Required for Google Sign-In & Email Import)

Get these from **Google Cloud Console** → **APIs & Services** → **Credentials**:

| Secret Name | Example Value | Description |
|-------------|---------------|-------------|
| `GOOGLE_WEB_CLIENT_ID` | `123456789-abc.apps.googleusercontent.com` | OAuth 2.0 Web Client ID |

---

## 📋 Step-by-Step Setup Instructions

### Step 1: Get Expo Token

```bash
# Option A: Via Website
1. Visit: https://expo.dev/settings/access-tokens
2. Click "Create Access Token"
3. Name: "FinanceFlow GitHub Actions"
4. Copy the token (starts with "ey...")

# Option B: Via CLI
npx eas login
# Then go to website to create a dedicated CI token
```

### Step 2: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your FinanceFlow project
3. Click ⚙️ **Settings** → **Project settings**
4. Scroll to **Your apps** section
5. If no Android app exists, click **Add app** → **Android**
6. Register with package name: `com.financeflow.app`
7. Download `google-services.json` (for reference only, don't commit!)
8. Copy the values from the Firebase SDK snippet:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",           // → FB_API_KEY
     authDomain: "...",          // → FB_AUTH_DOMAIN
     projectId: "...",           // → FB_PROJECT_ID
     storageBucket: "...",       // → FB_STORAGE_BUCKET
     messagingSenderId: "...",   // → FB_MESSAGING_SENDER_ID
     appId: "..."                // → FB_APP_ID
   };
   ```

### Step 3: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing one
3. Enable **Gmail API** and **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth client ID**
6. Application type: **Web application**
7. Add authorized redirect URIs:
   - `https://auth.expo.io/@yourusername/financeflow`
   - `https://accounts.google.com/.well-known/openid-configuration`
8. Copy the **Client ID** → `GOOGLE_WEB_CLIENT_ID`

### Step 4: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** tab
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret one by one:

```
Name: EXPO_TOKEN
Value: <paste your expo token>

Name: FB_API_KEY
Value: <paste your firebase api key>

Name: FB_AUTH_DOMAIN
Value: <paste your firebase auth domain>

Name: FB_PROJECT_ID
Value: <paste your firebase project id>

Name: FB_STORAGE_BUCKET
Value: <paste your firebase storage bucket>

Name: FB_MESSAGING_SENDER_ID
Value: <paste your firebase messaging sender id>

Name: FB_APP_ID
Value: <paste your firebase app id>

Name: GOOGLE_WEB_CLIENT_ID
Value: <paste your google web client id>
```

---

## 🚀 Testing the CI/CD Pipeline

### Manual Trigger Test

1. Go to **Actions** tab in your GitHub repository
2. Select **"Build Android APK"** workflow
3. Click **Run workflow** dropdown
4. Select branch: `main`
5. Click **Run workflow**

### Automatic Trigger

Push a commit to the `main` branch:

```bash
git add .
git commit -m "Trigger CI build"
git push origin main
```

### Verify Build Success

1. Watch the workflow progress in **Actions** tab
2. Click on the running job to see logs
3. On success, download APK from **Artifacts** section
4. Install on Android device for testing

---

## 🔒 Security Best Practices

✅ **DO:**
- Use separate Firebase projects for development and production
- Rotate tokens every 90 days
- Enable branch protection on `main`
- Review workflow runs regularly
- Use minimum required permissions for tokens

❌ **DON'T:**
- Never commit `.env` files
- Never share tokens in chat/email
- Never use production credentials in development
- Never disable secret scanning on your repository

---

## 🛠 Troubleshooting

### Build Fails with "Missing Secrets"

**Error:** `Error: Input required and not supplied: EXPO_TOKEN`

**Solution:**
1. Verify all 8 secrets are added correctly
2. Check for typos in secret names (case-sensitive!)
3. Ensure secrets are repository secrets, not organization secrets

### Build Fails with "Invalid Firebase Config"

**Error:** `FirebaseException: API key not valid`

**Solution:**
1. Double-check Firebase credentials match exactly
2. Ensure Firebase Android app is registered with correct package name
3. Verify API restrictions in Firebase Console allow your app

### EAS Build Queue is Full

**Solution:**
- Free tier has limited concurrent builds
- Wait for previous builds to complete
- Consider upgrading to EAS Production plan

---

## 📦 Optional: Additional Secrets for Advanced Features

| Secret Name | Purpose | Required |
|-------------|---------|----------|
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Deploy Cloud Functions | ❌ (Only if using backend) |
| `GMAIL_CLIENT_ID` | Server-side email ingestion | ❌ (Only if using email import) |
| `GMAIL_CLIENT_SECRET` | Server-side email ingestion | ❌ (Only if using email import) |
| `GMAIL_REFRESH_TOKEN` | Server-side email ingestion | ❌ (Only if using email import) |

---

## ✅ Verification Checklist

Before your first build, confirm:

- [ ] All 7 required secrets added to GitHub
- [ ] Expo token has build permissions
- [ ] Firebase Android app registered with package: `com.financeflow.app`
- [ ] Google OAuth client configured with redirect URIs
- [ ] `.env.example` exists in repository (template only)
- [ ] `.gitignore` includes `.env` pattern
- [ ] `eas.json` configured with production profile
- [ ] Branch protection enabled on `main`

---

**Next Steps:** After setting up secrets, run your first build and test the APK on an Android device!
