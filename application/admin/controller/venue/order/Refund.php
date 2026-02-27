<?php

namespace app\admin\controller\venue\order;

use addons\epay\library\Service;
use app\admin\model\venue\user\Balance;
use app\admin\model\venue\Venue;
use app\admin\model\venue\venue\Reserve;
use app\common\controller\Backend;
use Yansongda\Pay\Pay;


/**
 * 退款申请管理
 *
 * @icon fa fa-circle-o
 */
class Refund extends Backend
{

    /**
     * Refund模型对象
     * @var \app\admin\model\venue\order\Refund
     */
    protected $model = null;
    protected $searchFields = 'user.username';
    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\venue\order\Refund;
        $this->view->assign("statusList", $this->model->getStatusList());
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
                    ->with(['user'])
                    ->where($where)
                    ->order($sort, $order)
                    ->paginate($limit);

            foreach ($list as $row) {
                $row->visible(['id','user_id','order_id','refund_money','refund_desc','status','refund_no','createtime','refusetime','updatetime']);
                $row->visible(['user']);
				$row->getRelation('user')->visible(['username']);
            }

            $result = array("total" => $list->total(), "rows" => $list->items());

            return json($result);
        }
        return $this->view->fetch();
    }


    /*
    * 退款审核
    */
    public function process($ids){
        $refund = $this->model->find($ids);
        if ($this->request->isPost()){
            $status = $this->request->post("row.status");
            $desc = $this->request->post("row.desc");
            if ($status == 2){
                $this->model->save(["status"=>$status,"desc"=>$desc,"refusetime"=>time()],["id"=>$ids]);
                $refund_order = $this->model->where(["id"=>$ids])->find();
                $orderd = \app\admin\model\venue\order\Order::get($refund_order['order_id']);
                $orderd->status = 2;
                $orderd->save();
                return ["code"=>1,"msg"=>"审核成功"];
            }else{
                try {
                    //生成退款单号 查询订单
                    $refundNo = "TK".venue_orderNo();
                    $refund_order = $this->model->where(["id"=>$ids])->find();
                    $orderd = \app\admin\model\venue\order\Order::get($refund_order['order_id']);
                    if ($orderd['order_type']!=2 || $refund['yd_id']==0){
                        if ($orderd['pay_channel']==2){
                            //钱包支付退款
                            \app\common\model\User::money($orderd['order_amount_total'],$orderd['user_id'],"退款");
                            $result['return_code']="SUCCESS";
                        }else{
                            $order['transaction_id'] = $orderd['out_trade_no'];
                            $order['out_refund_no'] = $refundNo;
                            $order['total_fee'] = bcmul($orderd['order_amount_total'], 100, 0); // 原支付交易的订单总金额
                            $order['refund_fee'] = bcmul($orderd['order_amount_total'], 100, 0); // 退款金额
                            $order['notify_url'] = "";
                            $config = Service::getConfig();
                            $pay = Pay::wechat($config);
                            $result = $pay->refund($order);
                        }

                        if ($result['return_code']=="SUCCESS"){
                            //修改余额明细
                            $venue = Venue::get($orderd->venue_id);
                            $money = $venue['money'] - $orderd->order_amount_total;

                            Balance::create([
                                "type"=>2,
                                "order_no"=>$refundNo,
                                "money"=>$orderd->order_amount_total,
                                "balance"=>$money,
                                "user_id"=>$orderd['user_id'],
                                "createtime"=>time(),
                                "updatetime"=>time(),
                            ]);
                            Reserve::update(["refund"=>1,"is_cl"=>1,"refund_no"=>$refundNo,"order_status"=>1],["order_id"=>$refund_order['order_id']]);

                            $venue->money = $money;
                            $venue->save();
                            $orderd->status = 5;
                            $orderd->save();
                            $this->model->save(["status"=>4,"refund_no"=>$refundNo],["id"=>$ids]);
                            return ["code"=>1,"msg"=>"审核成功"];
                        }else{
                            return ["code"=>0,"msg"=>"退款失败"];
                        }

                    }else{
                        //单场次退款
                        $reserve = Reserve::get($refund['yd_id']);
                        if ($reserve['write']==1){
                            return ["code"=>0,"msg"=>"该场次已核销"];
                        }
                        if ($orderd['pay_channel']==2){
                            //钱包支付退款
                            \app\common\model\User::money($orderd['order_amount_total'],$orderd['user_id'],"退款");

                            $reserve->order_status = 1;
                            $reserve->save();

                            $result['return_code']="SUCCESS";
                        }else{
                            $order['transaction_id'] = $orderd['out_trade_no'];
                            $order['out_refund_no'] = $refundNo;
                            $order['total_fee'] = bcmul($orderd['order_amount_total'], 100, 0); // 原支付交易的订单总金额
                            $order['refund_fee'] = bcmul($reserve['goods_price'], 100, 0); // 退款金额
                            $order['notify_url'] = "";
                            $config = Service::getConfig();
                            $pay = Pay::wechat($config);
                            $result = $pay->refund($order);
                        }

                        if ($result['return_code']=="SUCCESS"){
                            //修改余额明细
                            $venue = Venue::get($orderd->venue_id);
                            $money = $venue['money'] - $reserve['goods_price'];

                            Balance::create([
                                "type"=>2,
                                "order_no"=>$refundNo,
                                "money"=>$reserve['goods_price'],
                                "balance"=>$money,
                                "user_id"=>$orderd['user_id'],
                                "createtime"=>time(),
                                "updatetime"=>time(),
                            ]);
                            $venue->money = $money;
                            $venue->save();
                            $reserve->refund = 1;
                            $reserve->is_cl = 1;
                            $reserve->order_status = 1;
                            $reserve->refund_no = $refundNo;
                            $reserve->save();
                            $this->model->save(["status"=>4,"refund_no"=>$refundNo],["id"=>$ids]);
                            //查询该订单下 所有场地是否已处理
                            $reserve_res = Reserve::where(['order_id'=>$orderd['id'],"is_cl"=>0])->find();
                            if (!$reserve_res){
                                $orderd->status = 5;
                            }
                            $count = Reserve::where(['order_id'=>$orderd['id']])->count();
                            if ($count>1){
                                $orderd->bf_refund = 1;
                            }
                            $orderd->save();

                            return ["code"=>1,"msg"=>"审核成功"];
                        }else{
                            return ["code"=>0,"msg"=>"退款失败"];
                        }
                    }
                }catch (\Exception $e){
                    return ["code"=>0,"msg"=>$e->getMessage()];
                }
            }


        }
        return $this->view->fetch();
    }


}
