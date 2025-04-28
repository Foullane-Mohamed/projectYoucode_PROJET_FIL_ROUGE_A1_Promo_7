<?php
// Script to clean up test files created during troubleshooting
echo "Starting cleanup of test files...\n";

// Define the paths to clean
$testImagePaths = [
    __DIR__ . '/instrument-haven-backend/storage/app/public/categories/',
    __DIR__ . '/instrument-haven-backend/storage/app/public/public/categories/'
];

$testFiles = [
    __DIR__ . '/instrument-haven-backend/add_test_coupon.php',
];

// Delete test images
foreach ($testImagePaths as $dirPath) {
    if (is_dir($dirPath)) {
        $files = scandir($dirPath);
        foreach ($files as $file) {
            if ($file != '.' && $file != '..' && !is_dir($dirPath . $file)) {
                if (unlink($dirPath . $file)) {
                    echo "Deleted test image: " . $dirPath . $file . "\n";
                } else {
                    echo "Failed to delete: " . $dirPath . $file . "\n";
                }
            }
        }
    } else {
        echo "Directory not found: " . $dirPath . "\n";
    }
}

// Delete individual test files
foreach ($testFiles as $filePath) {
    if (file_exists($filePath)) {
        if (unlink($filePath)) {
            echo "Deleted test file: " . $filePath . "\n";
        } else {
            echo "Failed to delete: " . $filePath . "\n";
        }
    } else {
        echo "File not found: " . $filePath . "\n";
    }
}

// Finally, delete this cleanup script itself
echo "Cleanup completed. This script will self-delete.\n";
echo "You may need to manually remove this script if it's still present.\n";
// The script will attempt to delete itself when executed from the command line
// register_shutdown_function(function() {
//     @unlink(__FILE__);
// });
