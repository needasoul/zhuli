<?php

namespace app\admin\controller\boost;

use app\common\controller\Backend;
use app\common\model\boost\Task;
use app\common\model\boost\Order;
use app\common\model\boost\Record;
use think\Db;

/**
 * 助力任务管理
 *
 * @icon fa fa-circle-o
 */
class Task extends Backend
{
    
    /**
     * Task 模型
     * @var \app\common\model\boost\Task
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new Task();
    }

    /**
     * 默认查看
     */
    public function index()
    {
        //设置过滤方法
        $this->relationsearch = true;
        
        if ($this->request->isAjax()) {
            //如果发送的来源是 Table 页面，是从这个表格中读取过来的数据
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
            
            $list = $this->model
                ->with(['user', 'category'])
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            
            // 转换为数组并添加额外字段
            $list = collection($list)->toArray();
            foreach ($list as &$item) {
                $item['username'] = isset($item['user']['username']) ? $item['user']['username'] : '';
                $item['nickname'] = isset($item['user']['nickname']) ? $item['user']['nickname'] : '';
                $item['category_name'] = isset($item['category']['name']) ? $item['category']['name'] : '';
                $item['progress'] = $item['total'] > 0 ? round(($item['completed'] / $item['total']) * 100) : 0;
            }
            
            $total = $this->model
                ->where($where)
                ->count();
            
            $result = array(
                "total" => $total,
                "rows"  => $list
            );
            
            return json($result);
        }
        
        return $this->view->fetch();
    }

    /**
     * 添加
     */
    public function add()
    {
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            if ($params) {
                $params = $this->preExcludeFields($params);
                
                if ($this->dataLimit && $this->dataLimitField) {
                    $params[$this->dataLimitField] = $this->dataLimitValue;
                }
                
                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace('.', '/', $this->model);
                        $validate = is_bool($this->modelValidate) ? $this->validate($name) : $this->validate($this->modelValidate);
                        $validate->check($params) || $this->error($validate->getError());
                    }
                    
                    $this->model->create($params);
                    $this->success();
                } catch (ValidateException | PDOException $e) {
                    $this->error($e->getMessage());
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        return $this->view->fetch();
    }

    /**
     * 编辑
     */
    public function edit($ids = null)
    {
        if ($this->request->isPost()) {
            $params = $this->request->post("row/a");
            if ($params) {
                $params = $this->preExcludeFields($params);
                
                try {
                    //是否采用模型验证
                    if ($this->modelValidate) {
                        $name = str_replace('.', '/', $this->model);
                        $validate = is_bool($this->modelValidate) ? $this->validate($name) : $this->validate($this->modelValidate);
                        $validate->check($params) || $this->error($validate->getError());
                    }
                    
                    $this->model->allowField(true)->save($params, ['id' => $ids]);
                    $this->success();
                } catch (ValidateException | PDOException $e) {
                    $this->error($e->getMessage());
                }
            }
            $this->error(__('Parameter %s can not be empty', ''));
        }
        
        $row = $this->model->with(['user', 'category'])->find($ids);
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        
        $this->view->assign('row', $row);
        return $this->view->fetch();
    }

    /**
     * 删除
     */
    public function del($ids = null)
    {
        if (!$ids) {
            $this->error(__('Parameter %s can not be empty', 'ids'));
        }
        
        $ids = $ids ? $ids : $this->request->param('ids');
        $count = 0;
        Db::startTrans();
        try {
            $list = $this->model->select($ids);
            foreach ($list as $item) {
                // 删除相关的订单和记录
                Order::where('task_id', $item->id)->delete();
                Record::where('task_id', $item->id)->delete();
                $item->delete();
                $count++;
            }
            Db::commit();
        } catch (PDOException $e) {
            Db::rollback();
            $this->error($e->getMessage());
        }
        
        if ($count) {
            $this->success();
        } else {
            $this->error(__('No rows were deleted'));
        }
    }

    /**
     * 批量设置状态
     */
    public function multi($ids = null)
    {
        if (!$ids) {
            $this->error(__('Parameter %s can not be empty', 'ids'));
        }
        
        $ids = $ids ? $ids : $this->request->param('ids');
        $status = $this->request->param('status');
        
        if (!$status) {
            $this->error(__('Please select a status'));
        }
        
        $count = 0;
        Db::startTrans();
        try {
            $list = $this->model->select($ids);
            foreach ($list as $item) {
                $item->status = $status;
                if ($status == 'completed') {
                    $item->completetime = time();
                }
                $item->save();
                $count++;
            }
            Db::commit();
        } catch (PDOException $e) {
            Db::rollback();
            $this->error($e->getMessage());
        }
        
        if ($count) {
            $this->success();
        } else {
            $this->error(__('No rows were updated'));
        }
    }

    /**
     * 审核任务
     */
    public function audit($ids = null)
    {
        if ($this->request->isPost()) {
            $params = $this->request->post();
            $ids = $params['ids'];
            $action = $params['action']; // pass 通过，reject 拒绝
            
            if (!$ids || !$action) {
                $this->error(__('Parameter error'));
            }
            
            Db::startTrans();
            try {
                $list = $this->model->select($ids);
                foreach ($list as $task) {
                    if ($action == 'pass') {
                        // 通过审核
                        $task->status = 'active';
                        $task->save();
                        
                        // 如果是新发布的任务，需要实际扣除金额（之前只是冻结）
                        // 这里可以根据业务需求调整
                    } elseif ($action == 'reject') {
                        // 拒绝审核，退还金额
                        $user = \app\common\model\User::find($task->user_id);
                        if ($user) {
                            $refundAmount = $task->deposit + $task->total_amount;
                            $user->setInc('money', $refundAmount);
                            
                            // 创建退款订单记录
                            Order::create([
                                'user_id' => $task->user_id,
                                'task_id' => $task->id,
                                'type' => 'publish',
                                'amount' => $refundAmount,
                                'status' => 'refunded'
                            ]);
                        }
                        
                        $task->status = 'cancelled';
                        $task->save();
                    }
                }
                
                Db::commit();
                $this->success('操作成功');
            } catch (PDOException $e) {
                Db::rollback();
                $this->error($e->getMessage());
            }
        }
        
        // 获取待审核的任务
        $ids = $ids ? $ids : $this->request->param('ids');
        $row = $this->model->with(['user', 'category'])->find($ids);
        
        $this->view->assign('row', $row);
        return $this->view->fetch();
    }

    /**
     * 任务详情
     */
    public function detail($ids = null)
    {
        $row = $this->model
            ->with(['user', 'category', 'records', 'orders'])
            ->find($ids);
            
        if (!$row) {
            $this->error(__('No Results were found'));
        }
        
        $this->view->assign('row', $row);
        return $this->view->fetch();
    }
}