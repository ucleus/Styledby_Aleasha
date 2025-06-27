<?php
echo "<h1>Server Debug Information</h1>";

echo "<h2>Current Directory:</h2>";
echo "<pre>" . getcwd() . "</pre>";

echo "<h2>Document Root:</h2>";
echo "<pre>" . $_SERVER['DOCUMENT_ROOT'] . "</pre>";

echo "<h2>Request URI:</h2>";
echo "<pre>" . $_SERVER['REQUEST_URI'] . "</pre>";

echo "<h2>Script Name:</h2>";
echo "<pre>" . $_SERVER['SCRIPT_NAME'] . "</pre>";

echo "<h2>Build Directory Contents:</h2>";
$buildPath = __DIR__ . '/build';
if (is_dir($buildPath)) {
    echo "<pre>";
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($buildPath)) as $file) {
        if ($file->isFile()) {
            echo $file->getPathname() . " (size: " . $file->getSize() . " bytes)\n";
        }
    }
    echo "</pre>";
} else {
    echo "<pre>Build directory not found at: $buildPath</pre>";
}

echo "<h2>Public Directory Contents:</h2>";
$publicPath = __DIR__;
echo "<pre>";
$files = scandir($publicPath);
foreach ($files as $file) {
    if ($file !== '.' && $file !== '..') {
        $fullPath = $publicPath . '/' . $file;
        if (is_dir($fullPath)) {
            echo "[DIR] $file\n";
        } else {
            echo "[FILE] $file (size: " . filesize($fullPath) . " bytes)\n";
        }
    }
}
echo "</pre>";

echo "<h2>Laravel App Check:</h2>";
if (file_exists(__DIR__ . '/../laravel_app/public/build/manifest.json')) {
    echo "<pre>✅ Laravel build found at ../laravel_app/public/build/</pre>";
    $manifest = file_get_contents(__DIR__ . '/../laravel_app/public/build/manifest.json');
    echo "<pre>Manifest contents:\n$manifest</pre>";
} else {
    echo "<pre>❌ Laravel build NOT found at ../laravel_app/public/build/</pre>";
}

echo "<h2>Environment Check:</h2>";
echo "<pre>";
echo "PHP Version: " . phpversion() . "\n";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "HTTP Host: " . $_SERVER['HTTP_HOST'] . "\n";
echo "</pre>";
?>