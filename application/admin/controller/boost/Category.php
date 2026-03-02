<?php

namespace app\admin\controller\boost;

use app\common\controller\Backend;
use app\common\model\boost\Category;

/**
 * 助力分类管理
 *
 * @icon fa fa-circle-o
 */
class Category extends Backend
{
    
    /**
     * Category 模型
     * @var \app\common\model\boost\Category
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = new Category();
    }
}