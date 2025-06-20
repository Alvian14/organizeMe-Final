<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';

     protected $fillable = [
        'title', 'description', 'image', 'deadline', 'user_id', 'category_id', 'status_id', 'priority_id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function status() {
        return $this->belongsTo(TaskStatus::class);
    }

    public function priority() {
        return $this->belongsTo(PriorityLevel::class);
    }
}
