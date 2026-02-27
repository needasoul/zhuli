<?php

namespace app\admin\controller\venue\order;

use app\admin\model\venue\activity\UserActivity;
use app\admin\model\venue\Coupon;
use app\admin\model\venue\coupon\Receive;
use app\admin\model\venue\goods\Goods;
use app\admin\model\User;
use app\admin\model\venue\venue\Reserve;
use app\admin\model\venue\venue\Venue;
use app\common\controller\Backend;
use think\Db;

/**
 * 订单管理
 *
 * @icon fa fa-circle-o
 */
class Order extends Backend
{

    /**
     * Order模型对象
     * @var \app\admin\model\venue\order\Order
     */
    protected $model = null;
    protected $searchFields = 'id,order_no,user.username';
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\venue\order\Order;
        $this->view->assign("orderTypeList", $this->model->getOrderTypeList());
        $this->view->assign("statusList", $this->model->getStatusList());
        $this->view->assign("couponStateList", $this->model->getCouponStateList());
        $this->view->assign("payChannelList", $this->model->getPayChannelList());
    }



    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */


    /**
     * 查看
     */
    public function index()
    {
        //当前是否为关联查询
        $this->relationSearch = true;
        //设置过滤方法
        $this->request->filter(['strip_tags', 'trim']);
        if ($this->request->isAjax()) {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField')) {
                return $this->selectpage();
            }
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();

            $list = $this->model
                ->with(['user','address'])
                ->where($where)
                ->order($sort, $order)
                ->paginate($limit);

            foreach ($list as $row) {

                $row->getRelation('user')->visible(['username']);
                $row->getRelation('address')->visible(['city','remark']);
                $row->new_address = $row->address->city.'/'.$row->address->remark;
            }

            $result = array("total" => $list->total(), "rows" => $list->items());

            return json($result);
        }
        return $this->view->fetch();
    }

    /**
     * 详情
     */
    public function detail($ids)
    {
        $list = $this->model
            ->with(['user','address','coupon','lesson'])
            ->where(['order.id' => $ids])
            ->find();

        if (!$list) {
            $this->error(__('No Results were found'));
        }

        foreach ($list as $row) {
            $row->getRelation('user')->visible(['username']);
            $row->getRelation('address')->visible(['city','remark']);
            $row->getRelation('coupon')->visible(['title']);
            $row->getRelation('lesson')->visible(['title']);
            $row->new_address = $row->address->city.'/'.$row->address->remark;

        }

        if ($this->request->isAjax()) {
            $this->success("Ajax请求成功", null, ['id' => $ids]);
        }
        $data = $list->toArray();

        if ($data['order_type']==2){
            //获取订单详情
            $data2 = Reserve::where(['order_id'=>$ids])->select()
                ->each(function($item){
                    $venue = Venue::get($item->venue_id);
                    $item->venue_title = $venue['name'];
                    $item->venue_image = cdnurl($venue['image'],true);
                    $area = \app\admin\model\venue\venue\Relationship::get($item->area_id);
                    if ($item->refund){
                        $item->write = "已退款";
                    }else{
                        if ($item->write){
                            $item->write = "已核销";
                        }else{
                            $item->write = "未核销";
                        }
                    }
                    $item->area_title = $area['name'];
                });
            $this->view->assign("data", $data2);

        }elseif ($data['order_type']==4){
            $name = UserActivity::where(['order_id'=>$ids])->value('name_list');
            if ($name){
                $name_list  = json_decode($name,true);
                $this->view->assign("name_list", $name_list);
            }else{
                $this->view->assign("name_list", []);
            }
        }
        $this->view->assign("row", $data);
        return $this->view->fetch();
    }

    /*
     * 发货
     */
    public function send($ids){
        if ($this->request->isPost()){
            $numbers = $this->request->post("row.numbers");
            $courier = $this->request->post("row.courier");
            if (empty($numbers) || empty($courier)){
                $this->error("参数不能为空");
            }
            //更新发货信息
            \app\admin\model\venue\order\Order::update(["numbers"=>$numbers,"courier"=>$courier,"delivery_time"=>time()],["id"=>$ids]);
            return ["code"=>1,"msg"=>"发货成功"];
        }
        //
        $data = $this->model
            ->where(['id' => $ids])
            ->field("courier,numbers")
            ->find();
        $this->view->assign("row", $data->toArray());
        return $this->view->fetch();
    }

    /*
     * 完成订单
     */
    public function complete($ids){
        //修改订单状态
        $this->model->save(["status"=>3],["id"=>$ids]);
        Reserve::where(['order_id'=>$ids])->update(['write'=>1]);
        return ["code"=>1,"msg"=>"修改订单状态成功"];
    }

    /*
     * 退款
     */
    public function refund($ids){
        $data = $this->model
            ->where(['id' => $ids])
            ->find();

        if ($data['order_type'] == 1){
            //积分订单退款
            //1.超过七天不可退款
            //2.增加库存
            //3.是否使用优惠券，如果使用优惠券，更新优惠券状态
            //4.返还用户积分
            //5.修改订单状态
            if ($data['status'] == 1){
                return ["code"=>0,"msg"=>"商品还未付款"];
            }

            if (time()-$data['pay_time']>60*60*24*7){
                return ["code"=>0,"msg"=>"超过七天不可退款"];
            }
            Db::startTrans();
            try {
                $goods = Goods::get($data['goods_id']);
                //增加库存
                Goods::update(["stock"=>bcadd($goods['stock'],$data['goods_count'])],["id"=>$goods['id']]);

                //更新优惠券状态
                if ($data['coupon_state'] == 1){
                    $coupon = Coupon::get($data['coupon_id']);
                    if (time() > $coupon['end_time']){
                        Receive::update(["state"=>-1],["user_id"=>$data['user_id'],"coupon_id"=>$data['coupon_id']]);
                    }else{
                        Receive::update(["state"=>0],["user_id"=>$data['user_id'],"coupon_id"=>$data['coupon_id']]);
                    }
                }

                //返还用户积分
                $user = User::get($data['user_id']);
                $integral = bcadd($user->integral,$data['order_amount_total']);
                User::update(["integral"=>$integral],["id"=>$data['user_id']]);

                //修改订单状态
                $this->model->save(["status"=>3],["id"=>$ids]);

                // 提交事务
                Db::commit();
            } catch (\Exception $e) {
                // 回滚事务
                Db::rollback();
                return ["code"=>0,"msg"=>"退款失败".$e->getMessage()];
            }
            return ["code"=>1,"msg"=>"退款成功"];
        }else{
            return ["code"=>0,"msg"=>"请到退款申请列表审核"];
        }
    }


}
