<?php

namespace app\admin\model\venue\venue;

use think\Model;


class Reserve extends Model
{

    // 表名
    protected $name = 'venue_reserve';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    protected $resultSetType = 'collection';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';

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
}
