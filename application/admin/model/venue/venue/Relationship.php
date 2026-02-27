<?php

namespace app\admin\model\venue\venue;

use think\Model;


class Relationship extends Model
{
    // 表名
    protected $name = 'venue_relationship';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    protected $resultSetType = 'collection';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];

    public function venue()
    {
        return $this->belongsTo('app\admin\model\venue\Venue', 'venue_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function rule()
    {
        return $this->belongsTo('app\admin\model\venue\area\Rule', 'rule_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

    public function type()
    {
        return $this->belongsTo('app\admin\model\venue\venue\Type', 'type_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
