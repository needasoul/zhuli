<?php

namespace app\admin\model\venue\lesson;

use think\Model;
use traits\model\SoftDelete;

class Lesson extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'venue_lesson';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [

    ];
    

    protected static function init()
    {
        self::afterInsert(function ($row) {
            $pk = $row->getPk();
            $row->getQuery()->where($pk, $row[$pk])->update(['weigh' => $row[$pk]]);
        });
    }

    
    public function getWeekdataList()
    {
        return ['1' => __('Weekdata 1'), '2' => __('Weekdata 2'), '3' => __('Weekdata 3'), '4' => __('Weekdata 4'), '5' => __('Weekdata 5'), '6' => __('Weekdata 6'), '7' => __('Weekdata 7')];
    }

    public function getStateList()
    {
        return ['0' => __('State 0'), '1' => __('State 1')];
    }


    public function getWeekdataTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['weekdata']) ? $data['weekdata'] : '');
        $valueArr = explode(',', $value);
        $list = $this->getWeekdataList();
        return implode(',', array_intersect_key($list, array_flip($valueArr)));
    }


    public function getStateTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['state']) ? $data['state'] : '');
        $list = $this->getStateList();
        return isset($list[$value]) ? $list[$value] : '';
    }

    protected function setWeekdataAttr($value)
    {
        return is_array($value) ? implode(',', $value) : $value;
    }


    public function type()
    {
        return $this->belongsTo('app\admin\model\venue\venue\Type', 'type_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function venue()
    {
        return $this->belongsTo('app\admin\model\venue\Venue', 'venue_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

}
