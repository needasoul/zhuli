<?php

namespace app\admin\model\venue;

use think\Model;

class CouponReceive extends Model
{
    // 表名
    protected $name = 'venue_coupon_receive';

    public function coupon()
    {
        return $this->belongsTo('Coupon', 'coupon_id', 'id', [], 'LEFT')->setEagerlyType(0);
    }


    
}
