<?php

namespace app\admin\controller\venue\venue;

use app\common\controller\Backend;
use think\exception\DbException;
use think\response\Json;

/**
 * 场馆类型管理
 *
 * @icon fa fa-circle-o
 */
class Type extends Backend
{

    /**
     * Type模型对象
     * @var \app\admin\model\venue\venue\Type
     */
    protected $model = null;
    protected $searchFields = 'id,venue_type';

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new \app\admin\model\venue\venue\Type;
        $this->view->assign("stateList", $this->model->getStateList());
    }



    /**
     * 默认生成的控制器所继承的父类中有index/add/edit/del/multi五个基础方法、destroy/restore/recyclebin三个回收站方法
     * 因此在当前控制器中可不用编写增删改查的代码,除非需要自己控制这部分逻辑
     * 需要将application/admin/library/traits/Backend.php中对应的方法复制到当前控制器,然后进行修改
     */

    /**
     * 查看
     *
     * @return string|Json
     * @throws \think\Exception
     * @throws DbException
     */
    public function index()
    {
        //设置过滤方法
        $this->request->filter(['strip_tags', 'trim']);
        if (false === $this->request->isAjax()) {
            return $this->view->fetch();
        }
        //如果发送的来源是 Selectpage，则转发到 Selectpage
        if ($this->request->request('keyField')) {
            return $this->selectpage();
        }
        [$where, $sort, $order, $offset, $limit] = $this->buildparams();
        $list = $this->model
            ->where($where)
            ->order($sort, $order)
            ->paginate($limit);
        $result = ['total' => $list->total(), 'rows' => $list->items()];
        return json($result);
    }

    public function vtype()
    {
        $venue_id = $this->request->request("custom.venue_id");
        $ids = \app\admin\model\venue\venue\Venue::where("id",$venue_id)->field("name,venue_type_id")->find();
        $mode_id = $this->request->request("keyValue");//解决编辑的时候数据不对问题
        if ($mode_id){
            $data = \app\admin\model\venue\venue\Type::whereIn("id",[$mode_id])->field("id,venue_type")->select();
        }else{
            $data = \app\admin\model\venue\venue\Type::whereIn("id",$ids['venue_type_id'])->field("id,venue_type")->select();
        }
        foreach ($data as $k => &$v){
            $v['id'] = $v['id']."|".$venue_id;
            $v['venue_type'] = $v['venue_type']."(".$ids['name'].")";
        }
        return ["list"=>$data,"total"=>count($data)];
    }


}
