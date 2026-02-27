<?php

namespace app\admin\model\venue\activity;

use think\Model;
use traits\model\SoftDelete;

class UserActivity extends Model
{
    // 表名
    protected $name = 'venue_user_activity';
    protected $resultSetType = 'collection';

    public function activity()
    {
        return $this->belongsTo('app\admin\model\venue\activity\Activity', 'activity_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


}
