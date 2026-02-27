<?php

namespace app\admin\model\venue\user;

use think\Model;


class Signin extends Model
{

    // 表名
    protected $name = 'venue_user_signin';

    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
