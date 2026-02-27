<?php

namespace app\admin\model\venue\app;

use think\Model;


class Url extends Model
{

    // 表名
    protected $name = 'venue_app_url';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = false;
    protected $updateTime = false;
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];

    public function type()
    {
        return $this->belongsTo('Type', 'category_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
