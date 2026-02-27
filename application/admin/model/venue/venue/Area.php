<?php

namespace app\admin\model\venue\venue;

use think\Model;
use traits\model\SoftDelete;

class Area extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'venue_area_rule';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'interval_time_text',
        'state_text'
    ];
    

    protected static function init()
    {
        self::afterInsert(function ($row) {
            $pk = $row->getPk();
            $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
        });
    }

    


    public function getStateList()
    {
        return ['0' => __('State 0'), '1' => __('State 1')];
    }

    public function getintervalList()
    {
        return ['0.5'=>0.5,'1' => 1, '2' => 2, '3' => 3,'4'=>4,'5'=>5];
    }


    public function getIntervalTimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['interval_time']) ? $data['interval_time'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }


    public function getStateTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['state']) ? $data['state'] : '');
        $list = $this->getStateList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    protected function setIntervalTimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }


}
