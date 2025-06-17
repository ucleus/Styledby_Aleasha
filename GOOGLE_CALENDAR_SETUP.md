# Google Calendar Integration Setup

This guide will help you set up Google Calendar integration for your Styles by Aleasha booking system.

## 🎯 What This Integration Does

- **Real-time availability checking** - Prevents double bookings
- **Automatic event creation** - Creates calendar events when appointments are booked
- **Sync with your personal calendar** - See all appointments in Google Calendar
- **Email notifications** - Automatic reminders for both you and customers
- **Event management** - Update/cancel events from both the app and Google Calendar

## 📋 Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Your Styles by Aleasha Laravel application

## 🔧 Setup Steps

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "Styles by Aleasha Calendar"

### Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Calendar API"
3. Click on it and press **Enable**

### Step 3: Create Service Account (Recommended)

**For server-to-server access (no user login required):**

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Name: `styles-calendar-service`
4. Click **Create and Continue**
5. Skip role assignment for now
6. Click **Done**
7. Click on the created service account
8. Go to **Keys** tab
9. Click **Add Key** > **Create New Key**
10. Choose **JSON** format
11. Download the JSON file
12. Rename it to `google-service-account.json`
13. Place it in `storage/app/` directory

### Step 4: Share Calendar with Service Account

1. Open [Google Calendar](https://calendar.google.com)
2. Go to your calendar settings (gear icon > Settings)
3. Select your calendar from the left sidebar
4. Scroll to **Share with specific people**
5. Click **Add people**
6. Enter the service account email (from the JSON file: `client_email`)
7. Set permission to **Make changes to events**
8. Click **Send**

### Step 5: Configure Environment Variables

Add these to your `.env` file:

```bash
# Google Calendar Integration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALENDAR_ID=primary
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=storage/app/google-service-account.json
```

### Step 6: Install Dependencies

The Google API client is already installed. If you need to reinstall:

```bash
composer require google/apiclient
```

### Step 7: Run Database Migration

```bash
php artisan migrate
```

This adds the `google_event_id` column to store Google Calendar event IDs.

### Step 8: Test the Integration

1. Start your Laravel server: `php artisan serve`
2. Start your frontend: `npm run dev`
3. Go to the booking page
4. Try booking an appointment
5. Check your Google Calendar to see if the event was created

## 🔄 Alternative Setup: OAuth 2.0 (For user authentication)

If you prefer OAuth 2.0 (requires user login):

### Step 1: Create OAuth 2.0 Credentials

1. In Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Name: `Styles by Aleasha Web Client`
5. Add authorized redirect URIs:
   - `http://localhost:8000/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback`
6. Copy the Client ID and Client Secret

### Step 2: Update Environment Variables

```bash
GOOGLE_CLIENT_ID=your_oauth_client_id
GOOGLE_CLIENT_SECRET=your_oauth_client_secret
```

## 📅 Calendar Features Available

### ✅ Currently Implemented

- Real-time availability checking
- Automatic appointment creation
- Event cancellation
- Conflict prevention
- Time slot generation

### 🚧 Ready to Implement

- Appointment rescheduling
- Recurring availability windows
- Multiple calendar support
- Custom reminder settings
- Timezone handling

## 🧪 Testing Your Integration

### Test Available Slots

```bash
curl -X POST http://localhost:8000/api/availability/slots \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-06-20",
    "service_type_id": 1
  }'
```

### Test Appointment Creation

```bash
curl -X POST http://localhost:8000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token" \
  -d '{
    "firebase_uid": "user_id",
    "service_type_id": 1,
    "start_at": "2025-06-20 10:00:00"
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Make sure the service account has calendar access
   - Check that the JSON file path is correct

2. **"Calendar not found" errors**
   - Verify the calendar ID in your `.env` file
   - For primary calendar, use `primary`
   - For specific calendar, use the calendar ID from Google Calendar settings

3. **"Invalid credentials" errors**
   - Double-check your service account JSON file
   - Ensure the file is in the correct location

4. **Time zone issues**
   - Set your app timezone in `config/app.php`
   - Google Calendar will use the timezone set in your calendar

### Debug Mode

Enable logging in your GoogleCalendarService by adding:

```php
\Log::info('Google Calendar API Response:', $response);
```

## 🔒 Security Notes

- Keep your service account JSON file secure
- Never commit it to version control
- Add `storage/app/google-service-account.json` to `.gitignore`
- Use environment variables for all sensitive data

## 📞 Support

If you need help setting this up:

1. Check the Laravel logs: `storage/logs/laravel.log`
2. Enable debug mode: `APP_DEBUG=true` in `.env`
3. Test each step individually
4. Verify Google Cloud Console settings

## 🎉 You're Ready!

Once configured, your booking system will:

- ✅ Show real availability from your Google Calendar
- ✅ Prevent double bookings automatically
- ✅ Create calendar events for new appointments
- ✅ Send email notifications to customers
- ✅ Sync with your existing calendar workflow

Your customers will see a professional booking experience that's always accurate and up-to-date!