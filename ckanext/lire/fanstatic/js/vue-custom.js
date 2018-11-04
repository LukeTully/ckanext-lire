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


            var RowComponent = {
                template: '#rel-box-row',
                data: function () {
                    return {}
                },
                props: ['index', 'row']
            };
            var BoxComponent = {
                template: '#rel-box',
                data: function () {
                    return {
                        editing: -1,
                        currentRow: 0,
                        relationshipTypes: {
                            'child_of': "Child of",
                            'depends_on': 'depends on',
                            'derives_from': 'derives from',
                        },
                        newRow: {
                            subject: '',
                            object: '',
                            type: ''
                        }
                    }
                },
                props: ['relationships'],
                delimiters: ['${', '}'],
                computed: {
                    relTypes: function () {
                        // TODO: Debug this
                        var self = this;
                        var types = this.relationships.map(function (r) {
                            return r.type;
                        });
                        // for (var type in self.relationshipTypes) {
                        //     debugger;
                        //     if (self.relationshipTypes[types[type]]) types.splice(type, 1);
                        // }
                        var finalTypes = self.relationshipTypes;
                        for (var i = 0; i < types.length; i++) {
                            if (self.relationshipTypes[types[i]]) delete finalTypes[types[i]];
                        }
                        return finalTypes;
                    }
                },
                methods: {
                    handleEdit: function (index, row) {
                        console.log(index, row);
                        this.editing = index;
                        this.currentRow = index;
                        this.newRow = Object.assign({}, this.newRow, row);

                    },
                    save: function (index, oldRow) {

                        console.log("saving");

                        var self = this;
                        if (this.newRow.type !== oldRow.type) {
                            this.$ckan.client.call('POST', 'package_relationship_create', {
                                subject: this.newRow.subject,
                                object: this.newRow.object,
                                type: this.newRow.type
                            }, function (json, status) {

                                console.log("create successful");
                                // TODO: fix this splice
                                self.relationships.splice(index, 1, json.result);
                                // this.updateList();
                                self.editing = -1;
                            });

                            // Delete dis stuff
                            this.$ckan.client.call('POST', 'package_relationship_delete', {
                                subject: oldRow.subject,
                                object: oldRow.object,
                                type: oldRow.type
                            }, function (json, status) {
                                console.log("Successful delete was success");

                                console.log(json);
                                // TODO: update data here
                            });

                        }

                    },
                    updateList: function () {

                    },
                    handleDelete: function (index, row) {
                        console.log(index, row);

                        // this.$ckan.client.call('POST', 'package_relationship_delete', {
                        //     subject: row.subject,
                        //     object: row.object,
                        //     type: row.type
                        // }, function (json) {
                        //     console.log(json);
                        //     // this.updateList();
                        //
                        // });
                    }
                }
            };

            var Main = {
                data: {
                    tableData3: []
                },
                components: {
                    'relation-box': BoxComponent
                },
                delimiters: ['${', '}'],
                el: '#app',
                beforeCreate: function () {
                    var _self = this;
                    this.$ckan.client.call('GET', 'package_relationships', '', function (json) {
                        console.log(json);

                        _self.tableData3 = _self.tableData3.concat(json.result);
                    });
                }
            };
            Object.defineProperty(Vue.prototype, '$ckan', {value: this.sandbox});
            new Vue(Main);


        }
    }
});