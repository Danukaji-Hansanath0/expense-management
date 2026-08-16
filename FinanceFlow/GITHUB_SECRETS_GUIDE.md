# ===========================================
# GITHUB SECRETS SETUP GUIDE FOR FINANCEFLOW
# ===========================================
# Add these secrets in your GitHub repository:
# Settings > Secrets and variables > Actions > New repository secret

# -------------------------------------------
# EXPO/EAS BUILD SECRETS (Required for APK generation)
# -------------------------------------------
# 1. EXPO_TOKEN
#    - Get from: https://expo.dev/settings/access-tokens
#    - Create a new access token with "Build" permissions
#    - This allows GitHub Actions to trigger EAS builds

# 2. EAS_TOKEN (Alternative method, if needed)
#    - Same as above, some workflows use this name
#    - Run `eas login` locally first if you prefer this method

# -------------------------------------------
# FIREBASE CONFIGURATION SECRETS (Required for app functionality)
# These are injected into the .env file during CI build
# -------------------------------------------
# 3. FB_API_KEY
#    - From Firebase Console > Project Settings > General > Your apps > SDK setup and configuration
#    - Example: AIzaSyD...

# 4. FB_AUTH_DOMAIN
#    - From same location as above
#    - Example: your-project-id.firebaseapp.com

# 5. FB_PROJECT_ID
#    - From same location as above
#    - Example: financeflow-prod

# 6. FB_STORAGE_BUCKET
#    - From same location as above
#    - Example: financeflow-prod.appspot.com

# 7. FB_MESSAGING_SENDER_ID
#    - From same location as above
#    - Example: 123456789012

# 8. FB_APP_ID
#    - From same location as above
#    - Example: 1:123456789012:android:abc123def456

# -------------------------------------------
# GOOGLE AUTHENTICATION SECRETS (Required for Google Sign-In & Email Import)
# -------------------------------------------
# 9. GOOGLE_WEB_CLIENT_ID
#    - From Google Cloud Console > APIs & Services > Credentials
#    - Create OAuth 2.0 Client ID (Web application type)
#    - Add authorized redirect URIs for your app
#    - Example: 123456789-abc123def456.apps.googleusercontent.com

# -------------------------------------------
# OPTIONAL: CLOUD FUNCTIONS DEPLOYMENT (If deploying backend separately)
# -------------------------------------------
# 10. FIREBASE_SERVICE_ACCOUNT_KEY
#     - From Firebase Console > Project Settings > Service Accounts
#     - Generate new private key (JSON format)
#     - Paste the entire JSON content as the secret value
#     - Used for deploying Cloud Functions or server-side operations

# 11. GMAIL_CLIENT_ID (For email ingestion backend)
#     - From Google Cloud Console > APIs & Services > Credentials
#     - OAuth 2.0 Client ID for server-to-server communication

# 12. GMAIL_CLIENT_SECRET (For email ingestion backend)
#     - Paired with GMAIL_CLIENT_ID
#     - Keep this extremely secure!

# 13. GMAIL_REFRESH_TOKEN (For email ingestion backend)
#     - Obtained after initial OAuth flow with Gmail API
#     - Allows backend to access user's Gmail without re-authentication

# -------------------------------------------
# GITHUB RELEASE SECRETS (Optional - for auto-releases)
# -------------------------------------------
# 14. GITHUB_TOKEN
#     - Automatically provided by GitHub Actions
#     - No need to manually create this one
#     - Used for creating releases and uploading artifacts

# ===========================================
# HOW TO ADD SECRETS:
# ===========================================
# 1. Go to your GitHub repository
# 2. Click "Settings" tab
# 3. In left sidebar, click "Secrets and variables" > "Actions"
# 4. Click "New repository secret"
# 5. Enter the secret NAME (e.g., FB_API_KEY) exactly as shown above
# 6. Enter the secret VALUE (your actual credential)
# 7. Click "Add secret"
# 8. Repeat for all required secrets

# ===========================================
# SECURITY BEST PRACTICES:
# ===========================================
# ✓ Never commit actual .env files to Git
# ✓ Rotate tokens and keys regularly
# ✓ Use different Firebase projects for dev/staging/production
# ✓ Limit secret access to necessary workflows only
# ✓ Enable branch protection rules for main branch
# ✓ Review GitHub Actions logs regularly for suspicious activity
# ✓ Use environment-specific secrets for different deployment stages

# ===========================================
# VERIFICATION:
# ===========================================
# After adding secrets, test the workflow by:
# 1. Pushing a commit to main branch, OR
# 2. Going to Actions tab > "Build Android APK" > "Run workflow"
# 3. Check that build completes successfully
# 4. Download the APK from the workflow artifacts
