<?php

namespace app\admin\model\venue\lesson;

use think\Model;
use traits\model\SoftDelete;

class UserLesson extends Model
{
    // 表名
    protected $name = 'venue_user_lesson';

    public function lesson()
    {
        return $this->belongsTo('app\admin\model\venue\lesson\Lesson', 'lesson_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


}
