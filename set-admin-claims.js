/**
 * Script to set admin custom claims for Firebase users
 * 
 * Prerequisites:
 * 1. Install Firebase Admin SDK: npm install firebase-admin
 * 2. Download service account key from Firebase Console
 * 3. Set the path to your service account key below
 * 
 * Usage: node set-admin-claims.js <user-email>
 */

const admin = require('firebase-admin');

// TODO: Replace with your actual service account key file name
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdminClaim(email) {
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set admin custom claim
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Admin privileges granted to: ${email}`);
    console.log(`User UID: ${user.uid}`);
    console.log('\nThe user will need to sign out and sign back in for the changes to take effect.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin claim:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 To fix this:');
      console.log('1. Create a user account in Firebase Auth Console');
      console.log('2. Or sign up with this email first');
      console.log('3. Then run this script again');
    }
    
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node set-admin-claims.js <user-email>');
  console.log('Example: node set-admin-claims.js admin@example.com');
  process.exit(1);
}

console.log(`Setting admin privileges for: ${email}`);
setAdminClaim(email);