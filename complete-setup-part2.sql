-- ===================================
-- 9. Insert example blocked dates
-- ===================================
INSERT INTO `blocked_dates` (`blocked_date`, `type`, `reason`, `created_at`, `updated_at`) VALUES
('2025-12-25', 'full-day', 'Christmas Day', NOW(), NOW()),
('2025-12-24', 'full-day', 'Christmas Eve', NOW(), NOW()),
('2025-01-01', 'full-day', 'New Year\'s Day', NOW(), NOW()),
('2025-07-04', 'full-day', 'Independence Day', NOW(), NOW()),
('2025-11-28', 'full-day', 'Thanksgiving', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
`reason` = VALUES(`reason`),
`updated_at` = NOW();

-- ===================================
-- 10. Mark migrations as completed (Laravel requirement)
-- ===================================
INSERT INTO `migrations` (`migration`, `batch`) VALUES
('2025_06_10_033659_create_customers_table', 1),
('2025_06_10_033825_create_service_types_table', 1),
('2025_06_10_034116_create_appointments_table', 1),
('2025_06_18_233444_create_blocked_dates_table', 1),
('2025_06_18_233457_create_business_settings_table', 1),
('2025_06_18_234738_add_category_to_service_types_table', 1)
ON DUPLICATE KEY UPDATE `batch` = VALUES(`batch`);

-- ===================================
-- 11. Verify setup is complete
-- ===================================
SELECT 'Database setup completed successfully!' as status;

-- Show table counts
SELECT 
    (SELECT COUNT(*) FROM service_types) as services_count,
    (SELECT COUNT(*) FROM business_settings) as settings_count,
    (SELECT COUNT(*) FROM blocked_dates) as blocked_dates_count,
    (SELECT COUNT(*) FROM migrations) as migrations_count;

-- Show all tables created
SELECT TABLE_NAME, TABLE_ROWS 
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
AND TABLE_NAME IN ('customers', 'service_types', 'appointments', 'blocked_dates', 'business_settings', 'migrations')
ORDER BY TABLE_NAME;