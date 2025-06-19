<?php
// test-connection.php
$host = 'srv1007.hstgr.io';
$database = 'u652263477_tellerapp';
$username = 'u652263477_immie';
$password = 'NHiy6vjLy3o';

echo "Testing Hostinger Database Connection...\n";
echo "Host: $host\n";
echo "Database: $database\n";
echo "Username: $username\n";
echo "Password: " . str_repeat('*', strlen($password)) . "\n\n";

try {
    echo "Attempting connection...\n";
    $pdo = new PDO("mysql:host=$host;dbname=$database", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 10,
    ]);
    
    echo "✅ Connection successful!\n";
    echo "Server info: " . $pdo->getAttribute(PDO::ATTR_SERVER_INFO) . "\n";
    echo "MySQL version: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "\n";
    
    // Test a simple query
    $stmt = $pdo->query("SELECT 1 as test");
    $result = $stmt->fetch();
    echo "✅ Query test successful: " . $result['test'] . "\n";
    
    // Check existing tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "📋 Existing tables (" . count($tables) . "): " . implode(', ', $tables) . "\n";
    
} catch (PDOException $e) {
    echo "❌ Connection failed!\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    
    // Suggest solutions based on error code
    $errorCode = $e->getCode();
    
    switch ($errorCode) {
        case 1045:
            echo "💡 This is an authentication error. Possible fixes:\n";
            echo "   1. Check your database credentials in Hostinger hPanel\n";
            echo "   2. Verify the password is correct\n";
            echo "   3. Make sure the database user has proper permissions\n";
            break;
        case 2002:
            echo "💡 This is a connection error. Possible fixes:\n";
            echo "   1. Check if the host '$host' is correct\n";
            echo "   2. Verify your internet connection\n";
            echo "   3. Check if Hostinger database service is running\n";
            break;
        case 1044:
            echo "💡 This is a database access error. Possible fixes:\n";
            echo "   1. Verify the database name '$database' exists\n";
            echo "   2. Check user permissions for this database\n";
            break;
        default:
            echo "💡 Unknown error. Please:\n";
            echo "   1. Check Hostinger hPanel for database status\n";
            echo "   2. Contact Hostinger support\n";
            break;
    }
    
    echo "\n🔧 Common solutions:\n";
    echo "   • Add your IP to Remote MySQL in Hostinger hPanel\n";
    echo "   • Verify all credentials in hPanel → MySQL Databases\n";
    echo "   • Try connecting from the same server where the site is hosted\n";
}
?>