define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'venue/message/message/index' + location.search,
                    add_url: 'venue/message/message/add',
                    edit_url: 'venue/message/message/edit',
                    multi_url: 'venue/message/message/multi',
                    import_url: 'venue/message/message/import',
                    table: 'venue_message_push',
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
                        {field: 'message_type', title: __('模版类型'), searchList: {"1":__('顾客下单提醒模版')}, formatter: Table.api.formatter.normal},
                        {field: 'masterplate', title: __('masterplate'), operate: 'LIKE'},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            $("#c-title").data("params", function (obj) {
                //obj为SelectPage对象
                return {custom: {type: $("#c-type").val()}};
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            $("#c-title").data("params", function (obj) {
                //obj为SelectPage对象
                return {custom: {type: $("#c-type").val()}};
            });
            $(document).on("fa.event.appendfieldlist", "#second-table .btn-append", function (e, obj) {
                //绑定动态下拉组件
                Form.events.selectpage(obj);
            });
            Controller.api.bindevent();
        },
        edit: function () {
            $("#c-title").data("params", function (obj) {
                //obj为SelectPage对象
                return {custom: {type: $("#c-type").val()}};
            });
            $(document).on("fa.event.appendfieldlist", "#second-table .btn-append", function (e, obj) {
                //绑定动态下拉组件
                Form.events.selectpage(obj);
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
