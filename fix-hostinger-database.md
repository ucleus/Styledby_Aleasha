# Fix Hostinger Database Connection Issues

## 🚨 Current Error
```
SQLSTATE[HY000] [1045] Access denied for user 'u652263477_immie'@'::ffff:57.135.133.177' (using password: YES)
```

This error indicates a database authentication/connection issue with Hostinger.

## 🔧 Solutions to Try (In Order)

### Solution 1: Verify Database Credentials
1. **Log into Hostinger hPanel**
2. **Go to Websites → Manage → MySQL Databases**
3. **Double-check these values:**
   - Database name: `u652263477_tellerapp`
   - Username: `u652263477_immie`
   - Password: `NHiy6vjLy3o`
   - Host: `auth-db1007.hstgr.io`

### Solution 2: Test Connection with Simple PHP Script
Create a test file to isolate the connection issue:

```php
<?php
// test-connection.php
$host = 'auth-db1007.hstgr.io';
$database = 'u652263477_tellerapp';
$username = 'u652263477_immie';
$password = 'NHiy6vjLy3o';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    echo "✅ Connection successful!\n";
    echo "Server info: " . $pdo->getAttribute(PDO::ATTR_SERVER_INFO) . "\n";
} catch (PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "\n";
}
?>
```

Run: `php test-connection.php`

### Solution 3: Check IP Restrictions (Most Likely Issue)
Hostinger often restricts database access by IP address.

**Fix this by:**
1. **Go to Hostinger hPanel → MySQL Databases**
2. **Click "Remote MySQL" or "Manage" next to your database**
3. **Add your current IP address to allowed hosts**
   - Find your IP: `curl ifconfig.me` or visit whatismyip.com
   - Add your IP or use `%` for all IPs (less secure)

### Solution 4: Alternative Database Configuration
Try connecting with SSL and different options:

```env
# In your .env file, try these additional options:
DB_CONNECTION=mysql
DB_HOST=auth-db1007.hstgr.io
DB_PORT=3306
DB_DATABASE=u652263477_tellerapp
DB_USERNAME=u652263477_immie
DB_PASSWORD=NHiy6vjLy3o

# Add these SSL options if needed
DB_SSL_MODE=REQUIRED
DB_SSL_CERT=
DB_SSL_KEY=
DB_SSL_CA=
```

### Solution 5: Create New Database User
If the current user has issues:

1. **In Hostinger hPanel → MySQL Databases**
2. **Create a new database user with ALL PRIVILEGES**
3. **Update .env with new credentials**

### Solution 6: Use Local Development First
If Hostinger continues to have issues, develop locally first:

```env
# Local development database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=styles_by_aleasha_local
DB_USERNAME=root
DB_PASSWORD=
```

Then run:
```bash
# Create local database
mysql -u root -e "CREATE DATABASE styles_by_aleasha_local;"

# Run migrations locally
php artisan migrate
php artisan db:seed --class=AdminDashboardSeeder
```

### Solution 7: Contact Hostinger Support
If none of the above work:
1. **Contact Hostinger support** with this error
2. **Ask them to verify:**
   - Database user permissions
   - IP restrictions
   - SSL requirements
   - Host connectivity

## 🧪 Quick Tests to Run

### Test 1: Basic Connection
```bash
php test-connection.php
```

### Test 2: MySQL Command Line
```bash
mysql -h auth-db1007.hstgr.io -u u652263477_immie -p u652263477_tellerapp
# Enter password: NHiy6vjLy3o
```

### Test 3: Laravel Database Test
```bash
php artisan tinker
# Then run: DB::connection()->getPdo();
```

## 🎯 Most Likely Fix

**The most common issue is IP restrictions.** Hostinger usually blocks external connections to the database for security.

**Quick Fix:**
1. Log into Hostinger hPanel
2. Go to MySQL Databases → Remote MySQL
3. Add your IP address (get it from `curl ifconfig.me`)
4. Try the migration again

## 🔄 After Fixing Connection

Once the database connects successfully:

```bash
# Run migrations
php artisan migrate

# Seed initial data
php artisan db:seed --class=AdminDashboardSeeder

# Test the admin endpoints
curl http://localhost:8000/api/admin-public/blocked-dates
```

## 📞 Need Help?

If you're still stuck:
1. Try the IP address fix first (most common)
2. Run the test-connection.php script
3. Check Hostinger documentation for remote database access
4. Contact Hostinger support with the exact error message