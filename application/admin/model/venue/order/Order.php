<?php

namespace app\admin\model\venue\order;

use think\Model;


class Order extends Model
{

    

    

    // 表名
    protected $name = 'venue_order';
    
    // 自动写入时间戳字段
    protected $autoWriteTimestamp = 'integer';

    // 定义时间戳字段名
    protected $createTime = 'createtime';
    protected $updateTime = 'updatetime';
    protected $deleteTime = false;

    // 追加属性
    protected $append = [

    ];
    

    
    public function getOrderTypeList()
    {
        return ['1' => __('积分订单'), '2' => __('场馆订单'),'3' => __('课程订单'),'4' => __('活动订单'),'5' => __('充值订单')];
    }

    public function getStatusList()
    {
        return ['1' => __('Status 1'), '2' => __('Status 2'), '7' => __('Status 7') ,'3' => __('Status 3'), '4' => __('Status 4'), '5' => __('Status 5'), '6' => __('Status 6')];
    }

    public function getCouponStateList()
    {
        return ['0' => __('Coupon_state 0'), '1' => __('Coupon_state 1')];
    }

    public function getPayChannelList()
    {
        return ['0' => __('Pay_channel 0'), '1' => __('Pay_channel 1'), '2' => __('Pay_channel 2')];
    }


    public function getOrderTypeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['order_type']) ? $data['order_type'] : '');
        $list = $this->getOrderTypeList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getStatusTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['status']) ? $data['status'] : '');
        $list = $this->getStatusList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getCouponStateTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['coupon_state']) ? $data['coupon_state'] : '');
        $list = $this->getCouponStateList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getPayChannelTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['pay_channel']) ? $data['pay_channel'] : '');
        $list = $this->getPayChannelList();
        return isset($list[$value]) ? $list[$value] : '';
    }


    public function getPayTimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['pay_time']) ? $data['pay_time'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }


    public function getDeliveryTimeTextAttr($value, $data)
    {
        $value = $value ? $value : (isset($data['delivery_time']) ? $data['delivery_time'] : '');
        return is_numeric($value) ? date("Y-m-d H:i:s", $value) : $value;
    }

    protected function setPayTimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }

    protected function setDeliveryTimeAttr($value)
    {
        return $value === '' ? null : ($value && !is_numeric($value) ? strtotime($value) : $value);
    }


    public function user()
    {
        return $this->belongsTo('app\admin\model\User', 'user_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    public function address()
    {
        return $this->belongsTo('app\admin\model\venue\order\Address', 'address_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

    public function coupon()
    {
        return $this->belongsTo('app\admin\model\venue\Coupon', 'coupon_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }

    public function lesson()
    {
        return $this->belongsTo('app\admin\model\venue\lesson\Lesson', 'lesson_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }
}
