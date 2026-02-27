<?php

namespace app\admin\model\venue\message;

use think\Model;


class Message extends Model
{
    // 表名
    protected $name = 'venue_message_push';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = false;

    // 定义时间戳字段名
    protected $createTime = false;
    protected $updateTime = false;
    protected $deleteTime = false;

    // 追加属性
    protected $append = [
        'status_text'
    ];
    

    
    public function getStatusList()
    {
        return ['100' => __('Status 100')];
    }

    public function getTypeList()
    {
        return ['1' => __('顾客下单提醒模版')];
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }

}
