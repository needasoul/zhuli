<?php

namespace app\admin\controller\venue\order;

use app\admin\model\venue\venue\Reserve;
use app\common\controller\Backend;

/**
 * 收货地址管理
 *
 * @icon fa fa-circle-o
 */
class Write extends Backend
{

    /**
     * Address模型对象
     * @var \app\admin\model\venue\order\Address
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
    }



    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */


    /**
     * 核销订单
     */
    public function index()
    {
        if ($this->request->isPost()){
            $code = $this->request->post("code");
            $reserve = Reserve::get(["hx_code"=>$code]);
            if ($reserve){
                $reserve->is_cl = 1;
                $reserve->write = 1;
                $reserve->save();
                $reserve_hx = Reserve::where(['order_id'=>$reserve['order_id'],"is_cl"=>0])->find();
                if (!$reserve_hx){
                    //查看有没有退款的场次
                    $reserve_hxs = Reserve::where(['order_id'=>$reserve['order_id'],"is_cl"=>1,"refund"=>1])->find();
                    $order = \app\admin\model\venue\order\Order::get($reserve['order_id']);

                    if ($reserve_hxs){
                        $order->status = 5;
                        $order->bf_refund = 1;
                        $order->save();
                    }else{
                        $order->status = 3;
                        $order->write = 1;
                        $order->save();
                    }

                }
            }else{
                $order = \app\admin\model\venue\order\Order::get(["hx_code"=>$code]);
                if (!$order){
                    $this->error("核销码不正确");
                }else{
                    $order->status = 3;
                    $order->write = 1;
                    $order->save();
                }
            }
            $this->error("核销成功");
        }
        return $this->view->fetch();
    }

}
