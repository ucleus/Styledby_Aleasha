# Hostinger MySQL Database Setup Guide

This guide will help you set up the MySQL database on Hostinger to store all the admin dashboard data for Styles by Aleasha.

## 📋 Prerequisites

- Hostinger hosting account with MySQL database access
- Access to Hostinger control panel (hPanel)
- Your Laravel application already deployed

## 🗄️ Database Tables Overview

The admin dashboard requires these database tables:

1. **service_types** - Hair services (cuts, colors, styling, etc.)
2. **blocked_dates** - Dates blocked by admin (vacations, holidays)
3. **appointments** - Customer bookings
4. **customers** - Customer information
5. **business_settings** - Admin configuration settings

## 🚀 Step-by-Step Setup

### Step 1: Access Hostinger Database Panel

1. Log in to your Hostinger account
2. Go to **hPanel** → **Websites**
3. Select your domain → **Manage**
4. Find **MySQL Databases** section

### Step 2: Update Environment Variables

In your `.env` file, update the database credentials from Hostinger:

```env
# Database Configuration (from Hostinger)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1        # Usually: mysqlXX.hostinger.com
DB_PORT=3306
DB_DATABASE=your_database_name    # From Hostinger panel
DB_USERNAME=your_db_username      # From Hostinger panel
DB_PASSWORD=your_db_password      # From Hostinger panel
```

### Step 3: Run Database Migrations

Connect to your server (via SSH or File Manager) and run:

```bash
# Navigate to your Laravel project directory
cd /path/to/your/laravel/project

# Run the migrations to create tables
php artisan migrate

# Seed initial data (optional)
php artisan db:seed
```

### Step 4: Verify Database Setup

Check that these tables were created in your Hostinger MySQL database:

- ✅ `service_types`
- ✅ `blocked_dates` 
- ✅ `appointments`
- ✅ `customers`
- ✅ `business_settings`

## 🔧 Database Schema Details

### service_types table
```sql
- id (Primary Key)
- name (Service name)
- category (Hair Cut, Color, Styling, Treatment)
- duration_min (Duration in minutes)
- price_cents (Price in cents)
- description (Service description)
- is_active (Boolean - active/inactive)
- created_at, updated_at
```

### blocked_dates table
```sql
- id (Primary Key)
- blocked_date (Date to block)
- type (full-day or partial)
- start_time (For partial blocks)
- end_time (For partial blocks)
- reason (Optional reason)
- created_at, updated_at
```

### appointments table
```sql
- id (Primary Key)
- customer_id (Foreign key to customers)
- service_type_id (Foreign key to service_types)
- start_at (Appointment start time)
- end_at (Appointment end time)
- status (booked, paid, completed, canceled)
- amount_paid_cents (Payment amount)
- notes (Special notes)
- created_at, updated_at
```

### customers table
```sql
- id (Primary Key)
- firebase_uid (Firebase user ID)
- name (Customer name)
- email (Customer email)
- phone (Customer phone)
- created_at, updated_at
```

### business_settings table
```sql
- id (Primary Key)
- key (Setting key)
- value (Setting value)
- type (string, boolean, json, integer)
- description (Setting description)
- created_at, updated_at
```

## 🔗 API Endpoints Available

Once the database is set up, these admin API endpoints will be available:

### Blocked Dates Management
- `GET /api/admin-public/blocked-dates` - Get all blocked dates
- `POST /api/admin-public/blocked-dates` - Block a new date
- `DELETE /api/admin-public/blocked-dates/{id}` - Remove blocked date
- `POST /api/admin-public/blocked-dates/toggle` - Toggle date block status

### Services Management
- `GET /api/admin-public/services` - Get all services
- `POST /api/admin-public/services` - Create new service
- `PUT /api/admin-public/services/{id}` - Update service
- `DELETE /api/admin-public/services/{id}` - Delete service

### Appointments Management
- `GET /api/admin-public/appointments` - Get all appointments
- `PUT /api/admin-public/appointments/{id}` - Update appointment status

### Business Settings
- `GET /api/admin-public/settings` - Get all settings
- `POST /api/admin-public/settings` - Update settings

## 🛠️ Testing the Setup

### Test Database Connection

Create a simple test file to verify database connectivity:

```php
<?php
// test-db.php
require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as DB;

$host = 'your_hostinger_host';
$database = 'your_database_name';
$username = 'your_db_username';
$password = 'your_db_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password);
    echo "✅ Database connection successful!\n";
    
    // Test table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'service_types'");
    if ($stmt->rowCount() > 0) {
        echo "✅ service_types table exists\n";
    } else {
        echo "❌ service_types table missing\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
}
?>
```

### Test API Endpoints

Test the blocked dates API:

```bash
# Test get blocked dates
curl -X GET https://yourdomain.com/api/admin-public/blocked-dates

# Test block a date
curl -X POST https://yourdomain.com/api/admin-public/blocked-dates \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-12-25", "reason": "Christmas Day"}'
```

## 🎯 Initial Data Setup

### Add Default Services

```sql
INSERT INTO service_types (name, category, duration_min, price_cents, description, is_active) VALUES
('Women''s Cut & Style', 'Hair Cut', 60, 8500, 'Includes consultation, shampoo, precision cut, and style.', 1),
('Men''s Cut & Style', 'Hair Cut', 45, 4500, 'Includes consultation, shampoo, precision cut, and style.', 1),
('Color Service', 'Color', 120, 12000, 'Full color, balayage, highlights, or color correction.', 1),
('Blowout & Style', 'Styling', 45, 5500, 'Shampoo, blow dry, and styling for any occasion.', 1);
```

### Add Default Business Settings

```sql
INSERT INTO business_settings (key, value, type, description) VALUES
('business_name', 'Styles by Aleasha', 'string', 'Business name'),
('payment_processor', 'stripe', 'string', 'Primary payment processor'),
('require_deposit', 'true', 'boolean', 'Require deposit for bookings'),
('deposit_percentage', '50', 'integer', 'Deposit percentage'),
('working_hours', '{"start":"09:00","end":"17:00"}', 'json', 'Business hours');
```

## 🔐 Security Notes

1. **Remove Public Routes**: After testing, remove the `admin-public` routes in production
2. **Enable Authentication**: Use the protected `admin` routes with Firebase auth
3. **Database Backup**: Set up regular backups through Hostinger panel
4. **Environment Security**: Never commit `.env` file with real credentials

## 🚨 Troubleshooting

### Common Issues

1. **Migration Fails**: Check database credentials in `.env`
2. **Permission Denied**: Ensure database user has CREATE, ALTER, DROP permissions
3. **Connection Timeout**: Check Hostinger database host and port
4. **Foreign Key Errors**: Run migrations in correct order

### Error Messages

- `SQLSTATE[42000]` - Check database name and credentials
- `Connection refused` - Verify host and port
- `Access denied` - Check username and password

## 📞 Support

If you encounter issues:
1. Check Hostinger documentation
2. Contact Hostinger support for database connectivity issues
3. Review Laravel logs in `storage/logs/`

---

✅ **Once completed, your admin dashboard will have full database functionality for managing services, blocked dates, appointments, and business settings!**