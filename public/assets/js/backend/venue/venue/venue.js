define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'venue/venue/venue/index' + location.search,
                    add_url: 'venue/venue/venue/add',
                    edit_url: 'venue/venue/venue/edit',
                    del_url: 'venue/venue/venue/del',
                    multi_url: 'venue/venue/venue/multi',
                    import_url: 'venue/venue/venue/import',
                    table: 'venue_venue',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'weigh',
                fixedColumns: true,
                fixedRightNumber: 1,
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name'), operate: 'LIKE'},
                        {field: 'venue_type_id', title: __('Venue_type_id')},
                        {field: 'address', title: __('Address'), operate: 'LIKE'},
                        {field: 'image', title: __('Image'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'image_plan', title: __('Image_plan'), operate: false, events: Table.api.events.image, formatter: Table.api.formatter.image},
                        {field: 'tel', title: __('Tel'), operate: 'LIKE'},
                        {field: 'reward_points', title: __('预订赠送积分数'), operate: 'LIKE'},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'state', title: __('State'), searchList: {"0":__('State 0'),"1":__('State 1'),"2":__('State 2')}, formatter: Table.api.formatter.normal},
                        {
                            field: 'operate',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

        },




        recyclebin: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    'dragsort_url': ''
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: 'venue/venue/recyclebin' + location.search,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'name', title: __('Name'), align: 'left'},
                        {
                            field: 'deletetime',
                            title: __('Deletetime'),
                            operate: 'RANGE',
                            addclass: 'datetimerange',
                            formatter: Table.api.formatter.datetime
                        },
                        {
                            field: 'operate',
                            width: '140px',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            buttons: [
                                {
                                    name: 'Restore',
                                    text: __('Restore'),
                                    classname: 'btn btn-xs btn-info btn-ajax btn-restoreit',
                                    icon: 'fa fa-rotate-left',
                                    url: 'venue/venue/restore',
                                    refresh: true
                                },
                                {
                                    name: 'Destroy',
                                    text: __('Destroy'),
                                    classname: 'btn btn-xs btn-danger btn-ajax btn-destroyit',
                                    icon: 'fa fa-times',
                                    url: 'venue/venue/destroy',
                                    refresh: true
                                }
                            ],
                            formatter: Table.api.formatter.operate
                        }
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },

        add: function () {
            Template.helper("Fast", Fast);

            $(document).on("fa.event.appendfieldlist", "#second-table .btn-append", function (e, obj) {
                //绑定上传组件
                Form.events.faupload(obj);
                //上传成功回调事件，变更按钮的背景
                $(".upload-image", obj).data("upload-success", function (data) {
                    $(this).css("background-image", "url('" + Fast.api.cdnurl(data.url) + "')");
                })
            });

            Controller.api.bindevent();
        },
        edit: function () {
            Template.helper("Fast", Fast);

            $(document).on("fa.event.appendfieldlist", "#second-table .btn-append", function (e, obj) {
                //绑定上传组件
                Form.events.faupload(obj);
                //上传成功回调事件，变更按钮的背景
                $(".upload-image", obj).data("upload-success", function (data) {
                    $(this).css("background-image", "url('" + Fast.api.cdnurl(data.url) + "')");
                })
            });
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
