<?php
// Test API endpoints after database setup

echo "🧪 Testing Admin Dashboard API Endpoints\n";
echo "==========================================\n\n";

$baseUrl = 'http://localhost:8000';

// Test endpoints
$endpoints = [
    'Services' => '/api/admin-public/services',
    'Blocked Dates' => '/api/admin-public/blocked-dates',
    'Business Settings' => '/api/admin-public/settings',
    'Appointments' => '/api/admin-public/appointments'
];

foreach ($endpoints as $name => $endpoint) {
    echo "📡 Testing $name: $endpoint\n";
    
    $url = $baseUrl . $endpoint;
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        echo "   ❌ Error: $error\n";
    } elseif ($httpCode === 200) {
        $data = json_decode($response, true);
        if ($data && isset($data['success']) && $data['success']) {
            $count = is_array($data['data']) ? count($data['data']) : 'N/A';
            echo "   ✅ Success! HTTP $httpCode - Found $count items\n";
        } else {
            echo "   ⚠️  HTTP $httpCode - Response: " . substr($response, 0, 100) . "...\n";
        }
    } else {
        echo "   ❌ HTTP $httpCode - Response: " . substr($response, 0, 100) . "...\n";
    }
    echo "\n";
}

echo "🎯 Next Steps:\n";
echo "1. Run part 2 of the database setup in phpMyAdmin\n";
echo "2. Check the admin dashboard at: $baseUrl/admin\n";
echo "3. Test blocking dates in the calendar management\n";
echo "4. Configure payment processors in settings\n\n";

echo "📋 Database Tables Status:\n";
$tables = ['customers', 'service_types', 'appointments', 'blocked_dates', 'business_settings', 'migrations'];
foreach ($tables as $table) {
    echo "   • $table\n";
}
?>