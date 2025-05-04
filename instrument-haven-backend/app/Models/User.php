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
        'phone',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        'is_active',
    ];


    protected $hidden = [
        'password',
        'remember_token',
    ];


    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];
    
  
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
    

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    
  
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
    

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }
    
  
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
