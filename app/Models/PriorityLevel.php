<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PriorityLevel extends Model
{
    protected $table = 'priority_levels';

     protected $fillable = [
        'name'
    ];

}
