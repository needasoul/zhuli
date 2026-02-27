<?php

namespace app\admin\controller\venue\coupon;

use app\common\controller\Backend;

/**
 * 优惠券信息管理
 *
 * @icon fa fa-circle-o
 */
class Coupon extends Backend
{

    /**
     * Coupon模型对象
     * @var \app\admin\model\venue\coupon\Coupon
     */
    protected $model = null;
    protected $searchFields = 'id,title';
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\venue\coupon\Coupon;
        $this->view->assign("stateList", $this->model->getStateList());
    }



    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */


}
