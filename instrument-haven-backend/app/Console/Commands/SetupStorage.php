<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

class SetupStorage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:setup-storage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup storage symbolic links and create needed directories';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Setting up storage directories and links...');

        // Create the storage public directory if it doesn't exist
        if (!File::exists(storage_path('app/public'))) {
            File::makeDirectory(storage_path('app/public'), 0755, true);
            $this->info('Created storage/app/public directory');
        }

        // Create categories directory
        if (!File::exists(storage_path('app/public/categories'))) {
            File::makeDirectory(storage_path('app/public/categories'), 0755, true);
            $this->info('Created storage/app/public/categories directory');
        }

        // Create symbolic link
        $this->info('Creating symbolic link...');
        Artisan::call('storage:link');
        $this->info('Symbolic link created successfully!');

        $this->info('Storage setup completed successfully!');
        return Command::SUCCESS;
    }
}
