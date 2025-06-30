# Admin Dashboard Security Setup

## Overview
The admin dashboard is now fully protected with Firebase authentication and admin role verification. Only users with admin privileges can access the dashboard.

## Quick Development Setup

### For Development/Testing (Bypass Admin Check)
Add this to your `.env` file to bypass admin checks during development:

```env
VITE_BYPASS_ADMIN_CHECK=true
```

⚠️ **Warning**: This bypasses all admin security checks. Only use for development. Remove for production!

## Setting Up Admin Users

### 1. Create a Firebase Admin User
First, create a user account in Firebase Console or via Firebase Auth.

### 2. Grant Admin Privileges
You need to set a custom claim for admin users. This can be done via:

#### Option A: Firebase Admin SDK (Recommended)
```javascript
// Set admin custom claims using Firebase Admin SDK
const admin = require('firebase-admin');

async function setAdminClaim(uid) {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`Admin claim set for user: ${uid}`);
}
```

#### Option B: Firebase Functions
Create a Firebase function to set admin claims:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.setAdminClaim = functions.https.onCall(async (data, context) => {
  // Only allow existing admins to create new admins
  if (!context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can create new admins');
  }
  
  await admin.auth().setCustomUserClaims(data.uid, { admin: true });
  return { result: 'Admin claim set successfully' };
});
```

#### Option C: Using the Provided Script
1. Install Firebase Admin SDK: `npm install firebase-admin`
2. Download your service account key from Firebase Console
3. Update the path in `set-admin-claims.js`
4. Run: `node set-admin-claims.js user@example.com`

```bash
# Install Firebase Admin SDK
npm install firebase-admin

# Set admin claims for a user
node set-admin-claims.js admin@example.com
```

## Security Features Implemented

### 🔒 **Authentication Protection**
- All admin routes require Firebase authentication
- Admin-specific custom claims verification
- Automatic token refresh and validation

### 🛡️ **Route Protection**
- `/admin/*` routes are protected by `ProtectedRoute` component
- `/admin/login` is public for authentication
- Automatic redirects for unauthorized access

### 🔑 **API Security**
- All API calls include Firebase JWT tokens
- Backend validates tokens via Laravel Firebase middleware
- Admin endpoints require admin custom claims

### ⚡ **User Experience**
- Loading states during authentication checks
- Proper error handling and user feedback
- Secure logout functionality

## Admin Login Process

1. **Access**: Navigate to `/admin/login`
2. **Authenticate**: Enter admin email and password
3. **Verification**: System checks for admin custom claims
4. **Access Granted**: Redirect to admin dashboard

## Password Reset
- Available on login page
- Sends reset email via Firebase Auth
- Secure password reset flow

## Logout Security
- Proper Firebase sign-out
- Clears all authentication state
- Redirects to login page

## Error Handling
- Invalid credentials
- Insufficient permissions
- Token expiration
- Network errors

## Testing Admin Access

1. Create a test user in Firebase Console
2. Set admin custom claim using one of the methods above
3. Test login at `/admin/login`
4. Verify dashboard access and functionality

## Important Notes
- Never store admin passwords in code
- Regularly rotate Firebase service account keys
- Monitor admin access logs
- Use environment variables for sensitive config
- Consider implementing role-based permissions for different admin levels