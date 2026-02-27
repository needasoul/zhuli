define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'venue/user/user/index' + location.search,
                    add_url: 'venue/user/user/add',
                    edit_url: 'venue/user/user/edit',
                    del_url: 'venue/user/user/del',
                    multi_url: 'venue/user/user/multi',
                    import_url: 'venue/user/user/import',
                    table: 'user',
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
                        {field: 'id', title: __('Id'), sortable: true},
                        {field: 'username', title: __('Username'), operate: 'LIKE'},
                        {field: 'email', title: __('Email'), operate: 'LIKE'},
                        {field: 'mobile', title: __('Mobile'), operate: 'LIKE'},
                        {field: 'avatar', title: __('Avatar'), events: Table.api.events.image, formatter: Table.api.formatter.image, operate: false},
                        {field: 'score', title: __('Score'), operate: false, table: table,
                            formatter: function (value, row, index) {
                                let num = value > 0 ? `<b style="color: #26ffb6;">（${value}）</b>` : `<b style="color: #26ffb6;">（0）</b>`;
                                return `<a href="venue/user/score?user_id=${row.id}" class="btn btn-xs btn-info btn-dialog" data-area="[&quot;95%&quot;,&quot;95%&quot;]" data-shade="[0.5,&quot;#000&quot;]" title="积分明细"><i class="fa fa-list"></i>积分明细${num}</a>`;
                            }},
                        {field: 'money', title: __('余额'), operate: false, table: table,
                            formatter: function (value, row, index) {
                            let num = value > 0 ? `<b style="color: #26ffb6;">（${value}）</b>` : `<b style="color: #26ffb6;">（0）</b>`;
                            return `<a href="venue/user/money?user_id=${row.id}" class="btn btn-xs btn-info btn-dialog" data-area="[&quot;95%&quot;,&quot;95%&quot;]" data-shade="[0.5,&quot;#000&quot;]" title="余额明细"><i class="fa fa-list"></i>余额明细${num}</a>`;
                        }},
                        {field: 'successions', title: __('Successions'), visible: false, operate: 'BETWEEN', sortable: true},
                        {field: 'maxsuccessions', title: __('Maxsuccessions'), visible: false, operate: 'BETWEEN', sortable: true},
                        {field: 'logintime', title: __('Logintime'), formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'loginip', title: __('Loginip'), formatter: Table.api.formatter.search},
                        {field: 'jointime', title: __('Jointime'), formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'joinip', title: __('Joinip'), formatter: Table.api.formatter.search},
                        {field: 'status', title: __('Status'), formatter: Table.api.formatter.status, searchList: {normal: __('Normal'), hidden: __('Hidden')}},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
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
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});
