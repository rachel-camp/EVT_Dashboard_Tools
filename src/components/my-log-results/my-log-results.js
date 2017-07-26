import './my-log-results.scss';

export class MyLogResultsController {

    constructor($scope, Logging, EVT) {
        "ngInject";
        this.$scope = $scope;
        this.Logging = Logging;
        this.EVT = EVT;
        this.chkd_props = [];
        this.out_html = '';
        this.thng_id = '';
        this.prop_hist = [];
        this.table = [];
        $scope.ctrl = this;


        this.$scope.$watch(Logging.getLogParams, function (params) {
            if (!angular.isUndefined(params) && params[0] !== null && !angular.isUndefined(params[0])) {
                $scope.ctrl.getlogs(params[0], params[1], params[2], params[3]);
            } else {
                $scope.ctrl.out_html = '';
            }
        });
    }

    $onDestroy() {
        this.chkd_props = [];
        this.out_html = '';
        this.thng_id = '';
        this.prop_hist = [];
        this.table = [];
    }

    getlogs(thng_id, properties, start_date, end_date) {
        this.prop_hist = [];
        this.out_html = `<div layout="row" layout-sm="column" layout-align="space-around">
                          <md-progress-circular md-mode="indeterminate" md-diameter="70"></md-progress-circular>
                         </div>`;
        this.thng_id = thng_id;
        this.chkd_props = properties;
        return Promise.all(
            this.chkd_props
                .map(prop => {
                    return this.EVT.operator.thng(this.thng_id).property(prop.name).read({
                        params: {
                            from: start_date,
                            to: end_date,
                            perPage: 100
                        }
                    }).then(history => {
                        this.printLogs(history, prop.name);
                    })
                })
        )
            .catch(err => {
                console.log('Failed to read logs', err);
            });
    }

    printLogs(history, name) {
        if (name !== '~connected') {
            this.prop_hist.push({ name: name, value: history });
        } else {
            this.prop_hist.push({ name: 'connected', value: history });
        }
        if (this.prop_hist.length === this.chkd_props.length) {
            this.makeTable();
        }
    }

    makeTable() {
        this.table = [];
        var html = '';
        var temp_obj = {};
        var times = [];
        this.prop_hist.sort(function (a, b) {
            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }// names must be equal
            return 0;
        });
        for (var i = 0; i < this.prop_hist.length; i++) {
            for (var j = 0; j < this.prop_hist[i].value.length; j++) {
                times.push(this.prop_hist[i].value[j].timestamp);
            }
        }
        times.sort();
        temp_obj.time = times[0];
        temp_obj.change = '';
        for (var i = 0; i < this.prop_hist.length; i++) {
            if (this.prop_hist[i].value.length !== 0) {
                var count = this.prop_hist[i].value.length - 1;
                if (times[0] === this.prop_hist[i].value[count].timestamp) {
                    temp_obj[this.prop_hist[i].name] = JSON.stringify(this.prop_hist[i].value[count].value);
                    if (temp_obj.change == '') {
                        if (this.prop_hist[i].name !== 'connected') {
                            temp_obj.change = this.prop_hist[i].name;
                        } else {
                            temp_obj.change = '~connected';
                        }
                    } else {
                        if (this.prop_hist[i].name !== 'connected') {
                            temp_obj.change += ', ' + this.prop_hist[i].name;
                        } else {
                            temp_obj.change += ', ~connected';
                        }
                    }
                } else {
                    temp_obj[this.prop_hist[i].name] = '-';
                }
            } else {
                temp_obj[this.prop_hist[i].name] = '-';
            }
        }
        this.table.push(temp_obj);
        for (var i = 1; i < times.length; i++) {
            temp_obj = {};
            temp_obj.time = times[i];
            var change = '';
            for (var j = 0; j < this.prop_hist.length; j++) {
                var new_val = this.table[i - 1][this.prop_hist[j].name];
                for (var k = 0; k < this.prop_hist[j].value.length; k++) {
                    if (times[i] === this.prop_hist[j].value[k].timestamp) {
                        change = this.prop_hist[j].name;
                        new_val = JSON.stringify(this.prop_hist[j].value[k].value);
                        //if (change === '') {
                        //    if (this.prop_hist[j].name !== 'connected') {
                        //        change = this.prop_hist[j].name;
                        //    } else {
                        //        change = '~connected';
                        //    }
                        //} else {
                        //    if (this.prop_hist[j].name !== 'connected') {
                        //        change += ', ' + this.prop_hist[j].name;
                        //    } else {
                        //        change += ', ~connected';
                        //    }
                        //}
                    }
                }
                temp_obj.change = change;
                temp_obj[this.prop_hist[j].name] = new_val;
            }
            this.table.push(temp_obj);
        }
        html += '<table>';
        html += '<tr>';
        html += '<th>Time</th>';
        html += '<th>Property Changed</th>';
        for (var i = 0; i < this.prop_hist.length; i++) {
            if (this.prop_hist[i].name !== 'connected') {
                html += '<th>' + this.prop_hist[i].name + '</th>';
            } else {
                html += '<th>~connected</th>';
            }
        }
        html += '</tr>';
        html += '<tr ng-repeat="x in $ctrl.table">';
        html += '<td class="log">{{ x.time | date: "medium"}}</td>';
        html += '<td class="log">{{ x.change }}</td>';
        for (var i = 0; i < this.prop_hist.length; i++) {
            html += '<td class="log">{{ x.' + this.prop_hist[i].name + ' }}</td>';
        }
        html += '</tr>';
        html += '</table>';
        this.out_html = html;
    }

}

export default {
    template: `
      <evtx-widget-base class="without-footer" evt-widget="$ctrl.evtWidget" on-config-change="$ctrl.$onConfigChange()">
        <widget-body layout="column" flex>
          <p compile="$ctrl.out_html"></p>
        </widget-body>
      </evtx-widget-base>
    `,

    controller: MyLogResultsController,

    bindings: {
        evtWidget: '<'
    },

    defaultConfig: {
        title: {
            required: true,
            value: 'Log Results'
        },

        description: {
            required: false,
            value: 'This widget shows the logs for a given search.'
        }
    }
}

angular.module('myModule.components.my-log-params', [])
    .directive('compile', ['$compile', function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }]);
