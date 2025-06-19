-- ==================================================
-- 1. Create `migrations` table (Laravel requirement)
-- ==================================================
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 2. Create `customers` table
-- ===================================
CREATE TABLE IF NOT EXISTS `customers` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `firebase_uid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customers_firebase_uid_unique` (`firebase_uid`),
  UNIQUE KEY `customers_email_unique` (`email`),
  KEY `customers_firebase_uid_index` (`firebase_uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 3. Create `service_types` table
-- ===================================
CREATE TABLE IF NOT EXISTS `service_types` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL DEFAULT 'Hair Cut',
  `duration_min` int(11) NOT NULL,
  `price_cents` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 4. Create `appointments` table
-- ===================================
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `service_type_id` bigint(20) UNSIGNED NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `status` enum('booked','paid','completed','canceled') NOT NULL,
  `square_payment_id` varchar(255) DEFAULT NULL,
  `amount_paid_cents` int(11) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `appointments_customer_id_foreign` (`customer_id`),
  KEY `appointments_service_type_id_foreign` (`service_type_id`),
  KEY `appointments_start_at_status_index` (`start_at`,`status`),
  KEY `appointments_square_payment_id_index` (`square_payment_id`),
  CONSTRAINT `appointments_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `appointments_service_type_id_foreign` FOREIGN KEY (`service_type_id`) REFERENCES `service_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 5. Create `blocked_dates` table
-- ===================================
CREATE TABLE IF NOT EXISTS `blocked_dates` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `blocked_date` date NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'full-day',
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blocked_dates_blocked_date_unique` (`blocked_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 6. Create `business_settings` table
-- ===================================
CREATE TABLE IF NOT EXISTS `business_settings` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'string',
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- 7. Insert default services
-- ===================================
INSERT INTO `service_types` (`name`, `category`, `duration_min`, `price_cents`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
('Women''s Cut & Style', 'Hair Cut', 60, 8500, 'Includes consultation, shampoo, precision cut, and style.', 1, NOW(), NOW()),
('Men''s Cut & Style', 'Hair Cut', 45, 4500, 'Includes consultation, shampoo, precision cut, and style.', 1, NOW(), NOW()),
('Color Service', 'Color', 120, 12000, 'Full color, balayage, highlights, or color correction.', 1, NOW(), NOW()),
('Blowout & Style', 'Styling', 45, 5500, 'Shampoo, blow dry, and styling for any occasion.', 1, NOW(), NOW()),
('Formal/Updo Styling', 'Styling', 60, 8500, 'Special occasion styling for weddings, proms, and events.', 1, NOW(), NOW()),
('Deep Conditioning Treatment', 'Treatment', 30, 3500, 'Intensive repair and hydration for damaged hair.', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
`category` = VALUES(`category`),
`updated_at` = NOW();

-- ===================================
-- 8. Insert default business settings
-- ===================================
INSERT INTO `business_settings` (`key`, `value`, `type`, `description`, `created_at`, `updated_at`) VALUES
('business_name', 'Styles by Aleasha', 'string', 'Business name', NOW(), NOW()),
('business_phone', '(555) 123-4567', 'string', 'Business phone number', NOW(), NOW()),
('business_email', 'info@stylesbyaleasha.com', 'string', 'Business email', NOW(), NOW()),
('business_address', '123 Main Street, City, State 12345', 'string', 'Business address', NOW(), NOW()),
('payment_processor', 'stripe', 'string', 'Primary payment processor', NOW(), NOW()),
('require_deposit', 'true', 'boolean', 'Require deposit for bookings', NOW(), NOW(_
