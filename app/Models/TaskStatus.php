<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskStatus extends Model
{
    protected $table = 'task_statuses';

    protected $fillable = [
        'name'
    ];
}
