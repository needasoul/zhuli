define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'venue/order/order/index' + location.search,
                    add_url: 'venue/order/order/add',

                    multi_url: 'venue/order/order/multi',
                    import_url: 'venue/order/order/import',
                    table: 'venue_order',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                fixedColumns: true,
                fixedRightNumber: 1,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'order_no', title: __('Order_no'), operate: 'LIKE'},
                        {field: 'order_type', title: __('Order_type'), searchList: {"1":__('Order_type 1'),"2":__('Order_type 2'),"3":__('Order_type 3'),"4":__('Order_type 4'),"5":__('充值订单')}, formatter: Table.api.formatter.normal},
                        {field: 'user.username', title: __('User.username'), operate: 'LIKE'},
                        {field: 'status', title: __('Status'), searchList: {"1":__('Status 1'),"2":__('Status 2'),"3":__('Status 3'),"4":__('Status 4'),"5":__('Status 5'),"6":__('Status 6'),"7":__('Status 7')}, formatter: Table.api.formatter.status},
                        {field: 'order_amount_total', title: __('Order_amount_total'), operate:'BETWEEN'},
                        {field: 'pay_channel', title: __('Pay_channel'), searchList: {"0":__('Pay_channel 0'),"1":__('Pay_channel 1'),"2":__('Pay_channel 2')}, formatter: Table.api.formatter.normal},
                        {field: 'remark', title: __('Remark'), operate: 'LIKE'},
                        {field: 'pay_time', title: __('Pay_time'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},


                        {
                            field: 'operate',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            formatter: Table.api.formatter.operate,
                            buttons: [

                                {
                                    name: 'detail',
                                    title: __('订单详情'),
                                    classname: 'btn btn-xs btn-primary btn-dialog',
                                    icon: 'fa fa-list',
                                    url: 'venue/order/order/detail',
                                    callback: function (data) {
                                        Layer.alert("接收到回传数据：" + JSON.stringify(data), {title: "回传数据"});
                                    }
                                },
                                {
                                    name: 'ajax',
                                    title: __('退款'),
                                    classname: 'btn btn-xs btn-success btn-magic btn-ajax',
                                    icon: 'fa fa-magic',
                                    confirm: '确认发起退款？',
                                    url: 'venue/order/order/refund',
                                    success: function (data, ret) {
                                        $(".btn-refresh").trigger("click");
                                        // Layer.alert(ret.msg + ",返回数据：" + JSON.stringify(data));
                                        //如果需要阻止成功提示，则必须使用return false;
                                        //return false;
                                    },
                                    error: function (data, ret) {
                                        console.log(data, ret);
                                        Layer.alert(ret.msg);
                                        return false;
                                    },
                                    visible: function (row) {
                                    if(row.status === '2' && row.order_type==1)
                                    {return true;}
                                    else
                                    {return false;}
                                    }
                                },


                                {
                                    name: 'ajax',
                                    title: __('完成订单'),
                                    classname: 'btn btn-xs btn-success btn-magic btn-ajax',
                                    icon: 'fa fa-leaf',
                                    confirm: '确认完成订单？',
                                    url: 'venue/order/order/complete',
                                    success: function (data, ret) {
                                        $(".btn-refresh").trigger("click");
                                        // return true;
                                    },
                                    error: function (data, ret) {
                                        console.log(data, ret);
                                        Layer.alert(ret.msg);
                                        // $(".btn-refresh").trigger("click");
                                        return false;
                                    },
                                    visible: function (row) {
                                        if(row.status != '3' && row.status != '5')
                                        {return true;}
                                        else
                                        {return false;}
                                    }

                                },

                            ],
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        send: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
