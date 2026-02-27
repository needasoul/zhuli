<?php

namespace app\admin\model\venue\user;

use think\Model;


class Balance extends Model
{

    

    

    // 表名
    protected $name = 'venue_store_balance';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [
        'type_text'
    ];
    

    
    public function getTypeList()
    {
        return ['1' => __('Type 1'), '2' => __('Type 2')];
    }


    public function getTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function venue()
    {
        return $this->belongsTo('app\admin\model\venue\Venue', 'venue_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

}
