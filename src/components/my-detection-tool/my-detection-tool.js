import './my-detection-tool.scss';

export class MyDetectionToolController {

    constructor($scope, Logging, EVT) {
        "ngInject";
        this.$scope = $scope;
        this.Logging = Logging;
        this.EVT = EVT;
        this.connected_devices_html = '';
        this.connected_html = '';
        this.sysid_in_html = '';
        this.start_date = new Date();
        this.end_date = new Date();
        this.today = new Date();
        this.start_date_unix = null;
        this.end_date_unix = null;
    }

    $onDestroy() {
        this.connected_devices_html = '';
        this.connected_html = '';
        this.sysid_in_html = '';
        this.start_date = null;
        this.end_date = null;
        this.today = null;
        this.start_date_unix = null;
        this.end_date_unix = null;
    }

    getThngs() {
        this.connected_devices_html = '';
        this.connected_html = '';
        this.sysid_in_html = '';
        var start_date_normal = '';
        var month = this.start_date.getMonth() + 1;
        if (month < 10) {
            start_date_normal += '0' + month;
        } else {
            start_date_normal += month;
        }
        if (this.start_date.getDate() < 10) {
            start_date_normal += '/0' + this.start_date.getDate();
        } else {
            start_date_normal += '/' + this.start_date.getDate();
        }
        start_date_normal += '/' + this.start_date.getFullYear();
        start_date_normal += ' 00:00:00';
        var end_date_normal = '';
        month = this.end_date.getMonth() + 1;
        if (month < 10) {
            end_date_normal += '0' + month;
        } else {
            end_date_normal += month;
        }
        if (this.end_date.getDate() < 10) {
            end_date_normal += '/0' + this.end_date.getDate();
        } else {
            end_date_normal += '/' + this.end_date.getDate();
        }
        end_date_normal += '/' + this.end_date.getFullYear();
        end_date_normal += ' 23:59:59';
        this.start_date_unix = (new Date(start_date_normal)).getTime();
        this.end_date_unix = (new Date(end_date_normal)).getTime();
        this.EVT.operator.thng().read({
            params: {
                filter: 'product=UFQdDBHwBXsRQpRaa2byXhbh&createdAt<' + this.end_date_unix
            }
        }).then(thngs => {
            this.sortThngs(thngs);
        });
    }

    sortThngs(thngs) {
        this.connected_devices_html = '<div class="head"><span class="md-title">Possible connected_devices Errors</span></div>';
        this.connected_html = '<div class="head"><span class="md-title">Possible ~connected Errors</span></div>';
        this.sysid_in_html = '<div class="head"><span class="md-title">Possible sysid_in Errors</span></div>';
        for (var i = 0; i < thngs.length; i++) {
            if (thngs[i].createdAt > this.start_date_unix) {
                this.searchNewThngErrors(thngs[i]);
            } else {
                this.searchThngErrors(thngs[i]);
            }
        }
    }

    searchThngErrors(thng) {
        //this.EVT.operator.thng(thng.id).property(`connected_devices`).read({
        //    params: {
        //        from: this.start_date_unix,
        //        to: this.end_date_unix,
        //        perPage: 100
        //    }
        //}).then(history => {
        //    this.checkHasError(history, `connected_devices`, thng);
        //    })
        this.EVT.operator.thng(thng.id).property(`~connected`).read({
            params: {
                from: this.start_date_unix,
                to: this.end_date_unix,
                perPage: 100
            }
        }).then(history => {
            this.checkConnectedError(history, thng);
        })
    }

    searchNewThngErrors(thng) {
        //this.EVT.operator.thng(thng.id).property(`connected_devices`).read({
        //    params: {
        //        from: this.start_date_unix,
        //        to: this.end_date_unix,
        //        perPage: 100
        //    }
        //}).then(history => {
        //    this.newHasError(history, `connected_devices`, thng);
        //})
        this.EVT.operator.thng(thng.id).property(`~connected`).read({
            params: {
                from: this.start_date_unix,
                to: this.end_date_unix,
                perPage: 100
            }
        }).then(history => {
            this.newConnectedError(history, `~connected`, thng);
        })
    }

    checkConnectedError(history, thng) {
        //switch (prop) {
        //    case 'connected_devices':
        //        if (history.length !== 0) {
        //            this.connected_devices_html += this.thngHtml(thng, history.length, prop, false);
        //        };
        //        break;
        //    case '~connected':
        if (history.length !== 0) {
            this.connected_html += this.thngHtml(thng, history.length, `~connected`, false);
        };
        this.EVT.operator.thng(thng.id).property(`connected_devices`).read({
            params: {
                from: this.start_date_unix,
                to: this.end_date_unix,
                perPage: 100
            }
        }).then(history => {
            this.checkConnectedDevicesError(history, thng, history.length);
        })
        //    break;
        //  case 'sysid_in':
        //    break;
        //}
    }

    checkConnectedDevicesError(history, thng, explained) {
        var dupe = history.length - explained;
        if (dupe !== 0) {
            this.connected_devices_html += this.thngHtml(thng, history.length, `connected_devices`, false);
        };
    }

    newConnectedError(history, prop, thng) {
        //switch (prop) {
        //    case 'connected_devices':
        //        if (history.length !== 1) {
        //            var count = history.length - 1;
        //            this.connected_devices_html += this.thngHtml(thng, count, prop, true);
        //        };
        //        break;
        //    case '~connected':
        var count = history.length - 1;
        if (count !== 0) {
            this.connected_html += this.thngHtml(thng, count, prop, true);
        };
        this.EVT.operator.thng(thng.id).property(`connected_devices`).read({
            params: {
                from: this.start_date_unix,
                to: this.end_date_unix,
                perPage: 100
            }
        }).then(history => {
            this.newCheckConnectedDevicesError(history, thng, count);
        })
        //        break;
        //    case 'sysid_in':
        //        break;
        //}
    }

    newCheckConnectedDevicesError(history, thng, explained) {
        var dupe = history.length - explained;
        if (dupe !== 1) {
            var count = history.length - 1;
            this.connected_devices_html += this.thngHtml(thng, count, `connected_devices`, true);
        };
    }

    thngHtml(thng, difference, prop, is_new) {
        var html = '<div class="result">';
        html += '<span class="md-title"> <a href="https://dashboard.evrythng.com/resources/thngs/' + thng.id + '" target="_blank">' + thng.name + '</a></span>';
        html += '<p>MAC Address: ' + thng.identifiers.mac_address + '</p>';
        if (difference < 0) {
            html += '<p class="problem">' + prop + ' is missing!</p>';
        } else {
            if (prop != 'sysid_in') {
                if (difference === 100) {
                    html += '<p>' + prop + ' changed more than 100 times.</p>';
                } else if (difference === 99 && is_new) {
                    html += '<p>' + prop + ' changed more than 100 times.</p>';
                } else if (difference === 1) {
                    html += '<p>' + prop + ' changed ' + difference + ' time.</p>';
                } else {
                    html += '<p>' + prop + ' changed ' + difference + ' times.</p>';
                }
            } else {
                html += '<p>' + prop + ' had ' + difference + ' entries than expected.</p>';
            }
        }
        html += '</div>';
        return html;
    }

}

export default {
    template: `
      <evtx-widget-base class="without-footer" evt-widget="$ctrl.evtWidget" on-config-change="$ctrl.$onConfigChange()">
        <widget-body layout="column" flex>
          <div class="container">
            <div class="col-md-3">
              <p><b>Start Date:</b>
              <md-datepicker ng-model="$ctrl.start_date" id="start_date" md-max-date="$ctrl.end_date"></md-datepicker></p>
            </div>
            <div class="col-md-3">
              <p><b>End Date:</b>
              <md-datepicker ng-model="$ctrl.end_date" id="end_date" md-max-date="$ctrl.today" md-min-date="$ctrl.start_date"></md-datepicker></p>
            </div>
            <div class="col-md-3">
              <md-button class="md-raised" ng-click = "$ctrl.getThngs();">Search</md-button>
            </div>
            <div class="col-sm-12">
              <div class="col-sm-4" ng-bind-html="$ctrl.connected_devices_html"></div>
              <div class="col-sm-4" ng-bind-html="$ctrl.connected_html"></div>
              <div class="col-sm-4" ng-bind-html="$ctrl.sysid_in_html"></div>
            </div>
          </div>
        </widget-body>
      </evtx-widget-base>
    `,

    controller: MyDetectionToolController,

    bindings: {
        evtWidget: '<'
    },

    defaultConfig: {
        title: {
            required: true,
            value: 'Error Detector'
        },

        description: {
            required: false,
            value: 'Shows a list of wifi modules possibly experiencing connection issues.'
        }
    }
}

angular.module('myModule.components.my-detection-tool', [])
    .directive('compile',
    [
        '$compile', function ($compile) {
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
        }
    ]);