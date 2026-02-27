define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'venue/venue/relationship/index' + location.search,
                    add_url: 'venue/venue/relationship/add',
                    edit_url: 'venue/venue/relationship/edit',
                    del_url: 'venue/venue/relationship/del',
                    multi_url: 'venue/venue/relationship/multi',
                    import_url: 'venue/venue/relationship/import',
                    table: 'venue_relationship',
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('Id')},
                        {field: 'venue.name', title: __('Venue.name'), operate: 'LIKE'},
                        {field: 'type.venue_type', title: __('场地类型')},
                        {field: 'name', title: __('Name'), operate: 'LIKE'},
                        {field: 'rule.name', title: __('Rule.name'), operate: 'LIKE'},
                        {field: 'area_rest', title: __('Area_rest'), operate: 'LIKE'},
                        {field: 'createtime', title: __('Createtime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'updatetime', title: __('Updatetime'), operate:'RANGE', addclass:'datetimerange', autocomplete:false, formatter: Table.api.formatter.datetime},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ]
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            $("#c-venue_id").on("change",function () {
                $("body").find("#c-venue_type_id_text").val('');
            })
            $("#c-venue_type_id").data("params", function () {// $("#add.html中的id值)
                return {
                    custom: {
                        venue_id: $("#c-venue_id").val()
                    }
                };
                //后续操作
            });
            Controller.api.bindevent();
        },
        edit: function () {
            $("#c-venue_id").on("change",function () {
                $("body").find("#c-venue_type_id_text").val('');
            })
            $("#c-venue_type_id").data("params", function () {// $("#add.html中的id值)
                return {
                    custom: {
                        venue_id: $("#c-venue_id").val()
                    }
                };
                //后续操作
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
