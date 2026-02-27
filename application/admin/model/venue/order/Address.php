<?php

namespace app\admin\model\venue\order;

use think\Model;
use traits\model\SoftDelete;

class Address extends Model
{

    use SoftDelete;

    

    // 表名
    protected $name = 'venue_address';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = 'deletetime';

    // 追加属性
    protected $append = [
        'tag_text'
    ];
    

    
    public function getTagList()
    {
        return ['家' => __('家'), '公司' => __('公司'), '学校' => __('学校')];
    }


    public function getTagTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['tag']) ? $data['tag'] : '');
        $list = $this->getTagList();
        return isset($list[$value]) ? $list[$value] : '';
    }




    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
