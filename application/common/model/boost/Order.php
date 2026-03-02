<?php

namespace app\common\model\boost;

use think\Model;

/**
 * 助力订单模型
 */
class Order extends Model
{
    // 表名
    protected $name = 'boost_order';
    
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    
    // 追加属性
    protected $append = [
        'status_text',
        'type_text'
    ];
    
    /**
     * 状态列表
     */
    public function getStatusList()
    {
        return [
            'pending' => '待支付',
            'paid' => '已支付',
            'completed' => '已完成',
            'cancelled' => '已取消',
            'refunded' => '已退款'
        ];
    }
    
    /**
     * 类型列表
     */
    public function getTypeList()
    {
        return [
            'publish' => '发布任务',
            'assist' => '参与任务'
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
     * 获取类型文本
     */
    public function getTypeTextAttr($value, $data)
    {
        $value = $value ?: (isset($data['type']) ? $data['type'] : '');
        $list = $this->getTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }
    
    /**
     * 关联用户
     */
    public function user()
    {
        return $this->belongsTo('app\common\model\User', 'user_id', 'id');
    }
    
    /**
     * 关联任务
     */
    public function task()
    {
        return $this->belongsTo('app\common\model\boost\Task', 'task_id', 'id');
    }
}