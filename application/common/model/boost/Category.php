<?php

namespace app\common\model\boost;

use think\Model;

/**
 * 助力分类模型
 */
class Category extends Model
{
    // 表名
    protected $name = 'boost_category';
    
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    
    // 追加属性
    protected $append = [
        'status_text'
    ];
    
    /**
     * 状态列表
     */
    public function getStatusList()
    {
        return [
            'normal' => '正常',
            'hidden' => '隐藏'
        ];
    }
    
    /**
     * 获取状态文本
     */
    public function getStatusTextAttr($value, $data)
    {
        $value = $value ?: (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }
    
    /**
     * 关联任务
     */
    public function tasks()
    {
        return $this->hasMany('app\common\model\boost\Task', 'category_id', 'id');
    }
}