# Styled by Aleasha Booking Platform

An interactive booking platform for a mobile hairstyling business, built with [Laravel](https://laravel.com) and [React](https://react.dev). The app lets clients reserve services, handles calendar availability, processes payments, and provides an admin dashboard for managing appointments.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Customization](#customization)
  - [Branding & Text](#branding--text)
  - [Services & Pricing](#services--pricing)
  - [Scheduling & Integrations](#scheduling--integrations)
- [Reusing for Another Company](#reusing-for-another-company)
- [Tech Stack](#tech-stack)
- [License](#license)

## Overview
Styled by Aleasha streamlines the process of booking mobile hairstyling services. Clients choose a service, pick an available time, enter their details, and optionally pay in advance. Administrators manage availability, upcoming appointments, and configuration through a secure dashboard.

## Features
<details>
<summary><strong>Client Booking Flow</strong></summary>

1. Pick a service from a curated list (cut, color, styling, etc.).
2. Choose an open date and time that respects the stylist's availability and existing events.
3. Enter contact information and notes.
4. Review and confirm the appointment; events are pushed to Google Calendar and stored in the app database.
</details>

<details>
<summary><strong>Admin Dashboard</strong></summary>

- View upcoming appointments and client details.
- Manually create, edit, or cancel bookings.
- Configure service options, business settings, and holiday blocks.
</details>

<details>
<summary><strong>Integrations</strong></summary>

- **Google Calendar** for real‑time availability and automatic event creation (see [`GOOGLE_CALENDAR_SETUP.md`](GOOGLE_CALENDAR_SETUP.md)).
- **Square Payments** for secure card processing ([`app/Services/SquarePaymentService.php`](app/Services/SquarePaymentService.php)).
- **Firebase** for authentication and notifications.
</details>

## How It Works
1. **Service Selection** – `resources/js/pages/BookingPage.jsx` defines available services with duration and price.
2. **Availability Check** – `app/Http/Controllers/Api/AvailabilityController.php` queries Google Calendar and the database to prevent double bookings.
3. **Booking Confirmation** – Once confirmed, appointments are written to the database and calendar; admin notifications are sent via `app/Notifications/AppointmentBooked.php`.
4. **Administration** – React components under `resources/js/pages/admin/` provide dashboards and settings for staff.

## Getting Started
1. Clone the repository.
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Install Node dependencies:
   ```bash
   npm install
   ```
4. Copy the example environment and set keys:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
5. Configure database credentials and run migrations:
   ```bash
   php artisan migrate --seed
   ```
6. Build assets and start the development server:
   ```bash
   npm run dev
   php artisan serve
   ```

## Customization
### Branding & Text
- Update the app name in `.env` (`APP_NAME`) and `config/app.php`.
- Replace logos or images in the `public/` directory.
- Edit navigation and copy in React components under `resources/js/`.

### Services & Pricing
- Modify the service list in [`resources/js/pages/BookingPage.jsx`](resources/js/pages/BookingPage.jsx).
- Adjust default durations, descriptions, and prices.
- Seed example data in `database/seeders/` or through the admin dashboard.

### Scheduling & Integrations
- Follow [`GOOGLE_CALENDAR_SETUP.md`](GOOGLE_CALENDAR_SETUP.md) to connect a different Google Calendar.
- Configure payment credentials in `.env` for Square or swap out `SquarePaymentService` with another provider.
- Tweak availability rules in `resources/js/pages/admin/components/AdminAvailability.jsx`.

## Reusing for Another Company
1. Fork or copy this repository.
2. Rename brand references (`Styled by Aleasha`) in environment files, React components, and documentation.
3. Replace logos and color schemes via Tailwind classes or your own CSS.
4. Update services/pricing to match the new business.
5. Set up new Google Calendar and payment credentials for the company.
6. Review `ADMIN_SETUP.md` and other setup guides to adjust admin users and database configuration.

## Tech Stack
- Laravel 10 (PHP backend & API)
- React 18 with Vite and Tailwind CSS
- Google Calendar API
- Square Payments API
- Firebase (authentication, notifications)

## License
This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

