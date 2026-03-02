<?php

namespace app\common\model\boost;

use think\Model;

/**
 * 助力记录模型
 */
class Record extends Model
{
    // 表名
    protected $name = 'boost_record';
    
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    
    // 追加属性
    protected $append = [
        'status_text',
        'earn_amount'
    ];
    
    /**
     * 状态列表
     */
    public function getStatusList()
    {
        return [
            'pending' => '待确认',
            'confirmed' => '已确认',
            'completed' => '已完成',
            'rejected' => '已拒绝'
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
     * 获取收益金额
     */
    public function getEarnAmountAttr($value, $data)
    {
        if (isset($data['status']) && $data['status'] == 'completed') {
            // 根据任务价格和助力次数计算收益
            $task = Task::find($data['task_id']);
            if ($task) {
                $assistCount = isset($data['assist_count']) ? $data['assist_count'] : 1;
                return $task->price * $assistCount;
            }
        }
        return 0;
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