<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
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

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];
    
    /**
     * Check if user is admin
     *
     * @return bool
     */
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
    
    /**
     * Get the orders for the user
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    
    /**
     * Get the cart for the user
     */
    public function cart()
    {
        return $this->hasOne(Cart::class);
    }
    
    /**
     * Get the wishlist items for the user
     */
    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }
    
    /**
     * Get the reviews for the user
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
