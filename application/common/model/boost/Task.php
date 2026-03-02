<?php

namespace app\common\model\boost;

use think\Model;

/**
 * 助力任务模型
 */
class Task extends Model
{
    // 表名
    protected $name = 'boost_task';
    
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    
    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    
    // 追加属性
    protected $append = [
        'status_text',
        'platform_name',
        'platform_icon',
        'progress',
        'status_class'
    ];
    
    /**
     * 状态列表
     */
    public function getStatusList()
    {
        return [
            'active' => '进行中',
            'completed' => '已完成',
            'cancelled' => '已取消',
            'expired' => '已过期'
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
     * 获取进度
     */
    public function getProgressAttr($value, $data)
    {
        $total = isset($data['total']) ? $data['total'] : 0;
        $completed = isset($data['completed']) ? $data['completed'] : 0;
        
        if ($total > 0) {
            return round(($completed / $total) * 100);
        }
        return 0;
    }
    
    /**
     * 获取状态样式类
     */
    public function getStatusClassAttr($value, $data)
    {
        $status = isset($data['status']) ? $data['status'] : '';
        $statusMap = [
            'active' => 'status-ongoing',
            'completed' => 'status-completed',
            'cancelled' => 'status-cancelled',
            'expired' => 'status-expired'
        ];
        return isset($statusMap[$status]) ? $statusMap[$status] : '';
    }
    
    /**
     * 获取平台名称
     */
    public function getPlatformNameAttr($value, $data)
    {
        $platform = isset($data['platform']) ? $data['platform'] : '';
        $platformMap = [
            'jd' => '京东',
            'pdd' => '拼多多',
            'taobao' => '淘宝',
            'douyin' => '抖音',
            'kuaishou' => '快手',
            'other' => '其他'
        ];
        return isset($platformMap[$platform]) ? $platformMap[$platform] : $platform;
    }
    
    /**
     * 获取平台图标
     */
    public function getPlatformIconAttr($value, $data)
    {
        $platform = isset($data['platform']) ? $data['platform'] : '';
        $iconMap = [
            'jd' => '/static/index/jd_icon.png',
            'pdd' => '/static/index/pdd_icon.png',
            'taobao' => '/static/index/taobao_icon.png',
            'douyin' => '/static/index/douyin_icon.png',
            'kuaishou' => '/static/index/kuaishou_icon.png',
            'other' => '/static/index/other_icon.png'
        ];
        return isset($iconMap[$platform]) ? $iconMap[$platform] : '/static/index/other_icon.png';
    }
    
    /**
     * 关联用户
     */
    public function user()
    {
        return $this->belongsTo('app\common\model\User', 'user_id', 'id');
    }
    
    /**
     * 关联分类
     */
    public function category()
    {
        return $this->belongsTo('app\common\model\boost\Category', 'category_id', 'id');
    }
    
    /**
     * 关联助力记录
     */
    public function records()
    {
        return $this->hasMany('app\common\model\boost\Record', 'task_id', 'id');
    }
    
    /**
     * 关联订单
     */
    public function orders()
    {
        return $this->hasMany('app\common\model\boost\Order', 'task_id', 'id');
    }
}