<?php

/**
 * This script fixes storage permissions and directories for the application
 */

// Create the products directory in storage if it doesn't exist
$productsPath = __DIR__ . '/storage/app/public/products';
if (!is_dir($productsPath)) {
    echo "Creating products directory: $productsPath\n";
    mkdir($productsPath, 0755, true);
}

// Create the public storage link if it doesn't exist
$publicPath = __DIR__ . '/public/storage';
if (!is_dir($publicPath)) {
    echo "Creating storage symlink...\n";
    
    // On Windows, symlinks can be problematic, so we use directory junction
    if (PHP_OS == 'WINNT') {
        exec('mklink /J "' . __DIR__ . '\public\storage" "' . __DIR__ . '\storage\app\public"');
    } else {
        symlink(__DIR__ . '/storage/app/public', $publicPath);
    }
    
    echo "Symlink created!\n";
} else {
    echo "Storage symlink already exists.\n";
}

// Copy some placeholder images if the products directory is empty
$files = glob($productsPath . '/*');
if (empty($files)) {
    echo "Products directory is empty. Adding placeholder images...\n";
    
    // Create placeholder directories and files
    if (!is_dir($productsPath)) {
        mkdir($productsPath, 0755, true);
    }
    
    // Create a text file with instructions
    file_put_contents($productsPath . '/README.txt', 
        "This directory should contain product images.\n" .
        "Make sure to set proper permissions for this directory.\n"
    );
    
    echo "Added placeholder files.\n";
} else {
    echo "Products directory already has files.\n";
}

echo "Storage setup complete!\n";
