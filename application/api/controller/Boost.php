<?php

namespace app\api\controller;

use app\common\controller\Api;
use app\common\model\boost\Task;
use app\common\model\boost\Order;
use app\common\model\boost\Category;
use app\common\model\boost\Record;
use think\Db;
use think\Validate;

/**
 * 助力功能接口
 */
class Boost extends Api
{
    protected $noNeedLogin = ['tasks', 'taskDetail', 'categories', 'search', 'stats'];
    protected $noNeedRight = ['*'];

    /**
     * 获取助力任务列表
     */
    public function tasks()
    {
        $page = $this->request->post('page', 1);
        $limit = $this->request->post('limit', 10);
        $category_id = $this->request->post('category_id', 0);
        $status = $this->request->post('status', 'active');
        
        $where = [];
        if ($category_id > 0) {
            $where['category_id'] = $category_id;
        }
        if ($status) {
            $where['status'] = $status;
        }
        
        $list = Task::where($where)
            ->with(['user', 'category'])
            ->order('createtime', 'desc')
            ->page($page, $limit)
            ->select();
            
        $total = Task::where($where)->count();
        
        $this->success('获取成功', [
            'list' => $list,
            'total' => $total,
            'page' => $page,
            'limit' => $limit
        ]);
    }

    /**
     * 获取助力任务详情
     */
    public function taskDetail()
    {
        $id = $this->request->post('id');
        if (!$id) {
            $this->error('任务ID不能为空');
        }
        
        $task = Task::with(['user', 'category'])->find($id);
        if (!$task) {
            $this->error('任务不存在');
        }
        
        // 获取发布者的统计信息
        $userStats = $this->getUserStats($task->user_id);
        $task->authorStats = $userStats;
        
        $this->success('获取成功', $task);
    }

    /**
     * 发布助力任务
     */
    public function publish()
    {
        if (!$this->auth->isLogin()) {
            $this->error('请先登录');
        }
        
        $data = $this->request->post();
        
        $validate = new Validate([
            'title' => 'require|max:100',
            'description' => 'require|max:500',
            'price' => 'require|float|gt:0',
            'total' => 'require|number|gt:0',
            'category_id' => 'require|number',
            'platform' => 'require|max:50',
            'link' => 'require|url',
            'notes' => 'max:500'
        ]);
        
        if (!$validate->check($data)) {
            $this->error($validate->getError());
        }
        
        // 计算总金额和押金
        $totalAmount = $data['price'] * $data['total'];
        $deposit = max($totalAmount * 0.1, 1); // 10%押金，最低1元
        $totalCost = $totalAmount + $deposit;
        
        // 检查用户余额
        $user = $this->auth->getUser();
        if ($user->money < $totalCost) {
            $this->error('余额不足，请先充值');
        }
        
        Db::startTrans();
        try {
            // 扣除用户余额
            $user->setDec('money', $totalCost);
            
            // 创建任务
            $task = Task::create([
                'user_id' => $this->auth->id,
                'title' => $data['title'],
                'description' => $data['description'],
                'price' => $data['price'],
                'total' => $data['total'],
                'completed' => 0,
                'category_id' => $data['category_id'],
                'platform' => $data['platform'],
                'link' => $data['link'],
                'notes' => isset($data['notes']) ? $data['notes'] : '',
                'status' => 'active',
                'deposit' => $deposit,
                'total_amount' => $totalAmount
            ]);
            
            // 创建订单记录
            Order::create([
                'user_id' => $this->auth->id,
                'task_id' => $task->id,
                'type' => 'publish',
                'amount' => $totalCost,
                'status' => 'paid'
            ]);
            
            Db::commit();
            $this->success('发布成功', $task);
            
        } catch (\Exception $e) {
            Db::rollback();
            $this->error('发布失败：' . $e->getMessage());
        }
    }

    /**
     * 参与助力任务
     */
    public function join()
    {
        if (!$this->auth->isLogin()) {
            $this->error('请先登录');
        }
        
        $taskId = $this->request->post('task_id');
        $assistCount = $this->request->post('assist_count', 1);
        
        if (!$taskId) {
            $this->error('任务ID不能为空');
        }
        
        if ($assistCount <= 0) {
            $this->error('助力次数必须大于0');
        }
        
        $task = Task::find($taskId);
        if (!$task) {
            $this->error('任务不存在');
        }
        
        if ($task->status != 'active') {
            $this->error('任务已结束或不可用');
        }
        
        if ($task->user_id == $this->auth->id) {
            $this->error('不能助力自己的任务');
        }
        
        // 检查是否还能助力
        $remaining = $task->total - $task->completed;
        if ($remaining < $assistCount) {
            $this->error('剩余助力次数不足');
        }
        
        Db::startTrans();
        try {
            // 创建助力记录
            $record = Record::create([
                'user_id' => $this->auth->id,
                'task_id' => $taskId,
                'assist_count' => $assistCount,
                'status' => 'pending'
            ]);
            
            // 更新任务完成数
            $task->setInc('completed', $assistCount);
            
            // 检查是否已完成
            if ($task->completed >= $task->total) {
                $task->status = 'completed';
                $task->save();
            }
            
            Db::commit();
            $this->success('参与成功', $record);
            
        } catch (\Exception $e) {
            Db::rollback();
            $this->error('参与失败：' . $e->getMessage());
        }
    }

    /**
     * 获取我的助力任务
     */
    public function myTasks()
    {
        if (!$this->auth->isLogin()) {
            $this->error('请先登录');
        }
        
        $type = $this->request->post('type', 'publish'); // publish, assist
        $page = $this->request->post('page', 1);
        $limit = $this->request->post('limit', 10);
        
        if ($type == 'publish') {
            // 我发布的任务
            $list = Task::where('user_id', $this->auth->id)
                ->with(['category'])
                ->order('createtime', 'desc')
                ->page($page, $limit)
                ->select();
            $total = Task::where('user_id', $this->auth->id)->count();
        } else {
            // 我参与的任务
            $list = Record::where('user_id', $this->auth->id)
                ->with(['task', 'task.category'])
                ->order('createtime', 'desc')
                ->page($page, $limit)
                ->select();
            $total = Record::where('user_id', $this->auth->id)->count();
        }
        
        $this->success('获取成功', [
            'list' => $list,
            'total' => $total,
            'page' => $page,
            'limit' => $limit
        ]);
    }

    /**
     * 获取助力订单列表
     */
    public function orders()
    {
        if (!$this->auth->isLogin()) {
            $this->error('请先登录');
        }
        
        $type = $this->request->post('type', 'all'); // all, publish, assist
        $status = $this->request->post('status', '');
        $page = $this->request->post('page', 1);
        $limit = $this->request->post('limit', 10);
        
        $where = ['user_id' => $this->auth->id];
        
        if ($type != 'all') {
            $where['type'] = $type;
        }
        
        if ($status) {
            $where['status'] = $status;
        }
        
        $list = Order::where($where)
            ->with(['task'])
            ->order('createtime', 'desc')
            ->page($page, $limit)
            ->select();
            
        $total = Order::where($where)->count();
        
        $this->success('获取成功', [
            'list' => $list,
            'total' => $total,
            'page' => $page,
            'limit' => $limit
        ]);
    }

    /**
     * 获取助力订单详情
     */
    public function orderDetail()
    {
        if (!$this->auth->isLogin()) {
            $this->error('请先登录');
        }
        
        $id = $this->request->post('id');
        if (!$id) {
            $this->error('订单ID不能为空');
        }
        
        $order = Order::with(['task', 'task.user'])->find($id);
        if (!$order) {
            $this->error('订单不存在');
        }
        
        if ($order->user_id != $this->auth->id) {
            $this->error('无权查看此订单');
        }
        
        $this->success('获取成功', $order);
    }

    /**
     * 获取助力收益统计
     */
    public function earnings()
    {
        if (!$this->auth->isLogin()) {
            $this->error('请先登录');
        }
        
        $userId = $this->auth->id;
        
        // 发布任务支出
        $publishExpense = Order::where('user_id', $userId)
            ->where('type', 'publish')
            ->where('status', 'paid')
            ->sum('amount');
            
        // 参与任务收入
        $assistIncome = Record::where('user_id', $userId)
            ->where('status', 'completed')
            ->sum('earn_amount');
            
        // 待结算收入
        $pendingIncome = Record::where('user_id', $userId)
            ->where('status', 'pending')
            ->sum('earn_amount');
        
        $this->success('获取成功', [
            'publish_expense' => $publishExpense ?: 0,
            'assist_income' => $assistIncome ?: 0,
            'pending_income' => $pendingIncome ?: 0,
            'net_earnings' => ($assistIncome - $publishExpense) ?: 0
        ]);
    }

    /**
     * 获取助力任务分类
     */
    public function categories()
    {
        $list = Category::where('status', 'normal')
            ->order('weigh', 'desc')
            ->select();
            
        $this->success('获取成功', $list);
    }

    /**
     * 搜索助力任务
     */
    public function search()
    {
        $keyword = $this->request->post('keyword');
        $page = $this->request->post('page', 1);
        $limit = $this->request->post('limit', 10);
        
        if (!$keyword) {
            $this->error('关键词不能为空');
        }
        
        $where = [];
        $where[] = ['title', 'like', '%' . $keyword . '%'];
        $where[] = ['status', '=', 'active'];
        
        $list = Task::where($where)
            ->with(['user', 'category'])
            ->order('createtime', 'desc')
            ->page($page, $limit)
            ->select();
            
        $total = Task::where($where)->count();
        
        $this->success('搜索成功', [
            'list' => $list,
            'total' => $total,
            'page' => $page,
            'limit' => $limit
        ]);
    }

    /**
     * 获取助力任务进度
     */
    public function progress()
    {
        $taskId = $this->request->post('task_id');
        if (!$taskId) {
            $this->error('任务ID不能为空');
        }
        
        $task = Task::find($taskId);
        if (!$task) {
            $this->error('任务不存在');
        }
        
        $progress = [
            'task_id' => $task->id,
            'total' => $task->total,
            'completed' => $task->completed,
            'remaining' => $task->total - $task->completed,
            'progress' => $task->total > 0 ? round(($task->completed / $task->total) * 100) : 0,
            'status' => $task->status
        ];
        
        $this->success('获取成功', $progress);
    }

    /**
     * 评价助力任务
     */
    public function rate()
    {
        if (!$this->auth->isLogin()) {
            $this->error('请先登录');
        }
        
        $taskId = $this->request->post('task_id');
        $rating = $this->request->post('rating');
        $comment = $this->request->post('comment', '');
        
        if (!$taskId || !$rating) {
            $this->error('参数不完整');
        }
        
        if ($rating < 1 || $rating > 5) {
            $this->error('评分必须在1-5之间');
        }
        
        $record = Record::where('user_id', $this->auth->id)
            ->where('task_id', $taskId)
            ->find();
            
        if (!$record) {
            $this->error('您未参与此任务');
        }
        
        if ($record->status != 'completed') {
            $this->error('任务未完成，无法评价');
        }
        
        $record->rating = $rating;
        $record->comment = $comment;
        $record->save();
        
        $this->success('评价成功');
    }

    /**
     * 获取助力任务统计数据
     */
    public function stats()
    {
        $stats = [
            'total_tasks' => Task::where('status', 'active')->count(),
            'total_completed' => Task::where('status', 'completed')->count(),
            'total_users' => Task::distinct(true)->field('user_id')->count(),
            'today_new' => Task::whereTime('createtime', 'today')->count()
        ];
        
        $this->success('获取成功', $stats);
    }

    /**
     * 获取用户统计信息
     */
    private function getUserStats($userId)
    {
        return [
            'tasks' => Task::where('user_id', $userId)->count(),
            'success' => Task::where('user_id', $userId)->where('status', 'completed')->count(),
            'rating' => 98 // 可以扩展为实际计算的平均评分
        ];
    }
}