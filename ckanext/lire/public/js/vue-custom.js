"use strict";

/*
 *
 * This module adds an interactive table of all relationships in CKAN.
 *
 * title - the title of the dataset
 * license - the title of the dataset's copyright license
 * num_resources - the number of resources that the dataset has.
 *
 */

ckan.module('vue-custom', function ($) {
//                             Main.data.tableData3 = Main.data.tableData3.concat(json.result);
    return {
        initialize: function () {

            var Main = {
                data: {
                    tableData3: []
                },
                delimiters: ['${', '}'],
                el: '#app',
                beforeCreate: function () {
                    var _self = this;
                    this.$ckan.client.call('GET', 'package_relationships', '', function (json) {
                        console.log(json);

                        _self.tableData3 = _self.tableData3.concat(json.result);
                    });
                },
                methods: {
                    handleEdit: function (index, row) {
                        console.log(index, row);
                    },
                    updateList: function () {

                    },
                    handleDelete: function (index, row) {
                        console.log(index, row);

                        this.$ckan.client.call('POST', 'package_relationship_delete', {
                            subject: row.subject,
                            object: row.object,
                            type: row.type
                        }, function (json) {
                            console.log(json);
                            // this.updateList();

                        });
                    }
                }
            };
            Object.defineProperty(Vue.prototype, '$ckan', {value: this.sandbox});

            new Vue(Main);


        }
    }
});