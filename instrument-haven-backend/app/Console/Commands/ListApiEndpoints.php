<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;

class ListApiEndpoints extends Command
{
    
    protected $signature = 'api:list';


    protected $description = 'List all API endpoints with their methods and middlewares';

    public function handle()
    {
        $this->info("API Endpoints for ADINAN STORE");
        $this->info("============================");
        
        $routes = Route::getRoutes();
        
        $apiRoutes = [];
        
        foreach ($routes as $route) {
            if (str_starts_with($route->uri(), 'api/')) {
                $middlewares = implode(', ', $route->middleware());
                
                $apiRoutes[] = [
                    'method' => implode('|', $route->methods()),
                    'uri' => $route->uri(),
                    'name' => $route->getName(),
                    'action' => $route->getActionName(),
                    'middleware' => $middlewares,
                ];
            }
        }
        
        usort($apiRoutes, function ($a, $b) {
            return strcmp($a['uri'], $b['uri']);
        });
        
        $groups = [
            'Auth Routes' => [],
            'Public Routes' => [],
            'Protected Routes' => [],
            'Admin Routes' => [],
        ];
        
        foreach ($apiRoutes as $route) {
            if (str_contains($route['uri'], 'api/v1/auth')) {
                $groups['Auth Routes'][] = $route;
            } elseif (str_contains($route['uri'], 'api/v1/admin')) {
                $groups['Admin Routes'][] = $route;
            } elseif (str_contains($route['middleware'], 'auth:sanctum')) {
                $groups['Protected Routes'][] = $route;
            } else {
                $groups['Public Routes'][] = $route;
            }
        }
        
        // Display routes by group
        foreach ($groups as $groupName => $routes) {
            if (count($routes) > 0) {
                $this->info("\n$groupName:");
                $this->info(str_repeat('-', strlen($groupName) + 1));
                
                $this->table(
                    ['Method', 'URI', 'Middleware'],
                    array_map(function ($route) {
                        return [
                            $route['method'],
                            $route['uri'],
                            $route['middleware'],
                        ];
                    }, $routes)
                );
            }
        }
        
        $this->info("\nTotal Routes: " . count($apiRoutes));
    }
}
