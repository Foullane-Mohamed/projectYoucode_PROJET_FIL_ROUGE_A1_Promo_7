<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'address',
        'phone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function hasRole($roleName)
    {
        // Check the default role column
        if ($this->role === $roleName) {
            return true;
        }
        
        // Check the roles relationship
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function isAdmin()
    {
        return $this->hasRole('admin');
    }
    
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }
    
    public function addresses()
    {
        return $this->hasMany(Address::class);
    }
    
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
    
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
    
    public function hasPermission($permission)
    {
        foreach ($this->roles as $role) {
            if ($role->permissions()->where('name', $permission)->exists()) {
                return true;
            }
        }
        
        return false;
    }
}