<?php

namespace app\admin\controller\boost;

use app\common\controller\Backend;
use app\common\model\boost\Order;

/**
 * 助力订单管理
 *
 * @icon fa fa-circle-o
 */
class Order extends Backend
{
    
    /**
     * Order 模型
     * @var \app\common\model\boost\Order
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new Order();
    }

    /**
     * 默认查看
     */
    public function index()
    {
        if ($this->request->isAjax()) {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            
            $list = $this->model
                ->with(['user', 'task'])
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            
            $list = collection($list)->toArray();
            foreach ($list as &$item) {
                $item['username'] = isset($item['user']['username']) ? $item['user']['username'] : '';
                $item['task_title'] = isset($item['task']['title']) ? $item['task']['title'] : '';
            }
            
            $total = $this->model->where($where)->count();
            
            return json(["total" => $total, "rows" => $list]);
        }
        
        return $this->view->fetch();
    }
}