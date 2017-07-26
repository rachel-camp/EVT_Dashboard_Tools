import './my-log-params.scss';

export class MyLogParamsController {

    constructor($scope, Logging, EVT) {
        "ngInject";
        this.$scope = $scope;
        this.Logging = Logging;
        this.EVT = EVT;
        this.thng_html = '';
        this.param_html = '';
        this.thngs = [];
        this.all_props = [];
        this.thng_id = '';
        this.today = new Date();
        this.select = false;
        $scope.ctrl = this;


        this.$scope.$watch(Logging.getThngs, function (thngs) {
            if (!angular.isUndefined(thngs) && thngs !== null && !angular.isUndefined(thngs[0])) {
                $scope.ctrl.setThngs(thngs);
            } else {
                $scope.ctrl.thng_html = '';
                $scope.ctrl.param_html = '';
                $scope.ctrl.Logging.updateLogParams(null, null, null, null);
            }
        });
    }

    $onDestroy() {
        this.thng_html = '';
        this.param_html = '';
        this.thngs = [];
        this.all_props = [];
        this.thng_id = '';
        this.start_date = null;
        this.end_date = null;
        this.today = null;
        this.select = false;
        this.Logging.updateLogParams(null, null, null, null);
    }

    setThngs(thngs) {
        this.thngs = [];
        this.thng_html = '';
        this.param_html = '';
        var html = '';
        if (thngs !== null) {
            for (var i = 0; i < thngs.length; i++) {
                html += '<div class="col-lg-6 col-md-12"';
                html += '<div>';
                html += '<div class="userThng">';
                html += '<md-button class="md-raised" ng-click = "$ctrl.searchProperties($ctrl.thngs[' + i + ']);">' + thngs[i].name + '</md-button>';
                html += '<p><span class="md-body-2">Product Type:</span> ' + thngs[i].customFields.proddesc + '</p>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                this.thngs.push(thngs[i]);
            }
            this.thng_html = html;
        } else {
            this.thng_html = '';
        }
    }

    searchProperties(thngs) {
        this.start_date = new Date();
        this.start_date.setHours(0);
        this.start_date.setMinutes(0);
        this.start_date.setSeconds(0, 0);
        this.end_date = new Date();
        this.end_date.setHours(23);
        this.end_date.setMinutes(59);
        this.end_date.setSeconds(0, 0);
        this.param_html = '';
        this.all_props = [];
        this.thng_id = thngs.id;
        this.creation = new Date(thngs.createdAt);
        var html = '';
        var prop = thngs.properties;
        var strName, strValue;
        html += '<div class="col-md-7 col-xs-12">';
        html += '<div class="col-xs-2">';
        html += '<a ng-click=$ctrl.selectAll()><b>Selected</b></a>';
        html += '</div>';
        html += '<div class="col-xs-5">';
        html += '<p><b>Property Name</b></p>';
        html += '</div>';
        html += '<div class="col-xs-5">';
        html += '<p><b>Current Value</b></p>';
        html += '</div>';
        for (strName in prop) {
            strValue = JSON.stringify(prop[strName]);
            html += '<div class="col-xs-2">';
            html += '<input id="' + strName + '" type="checkbox">';
            html += '</div>';
            html += '<div class="col-xs-5">';
            html += '<p>' + strName + '</p>';
            html += '</div>';
            html += '<div class="col-xs-5">';
            html += '<p>' + strValue + '</p>';
            html += '</div>';
            this.all_props.push({ name: strName, value: strValue });
        }
        html += '</div>';
        html += '<div class="col-md-5 col-xs-12">';
        html += '<div class="row">';
        html += '<p>Start Date and Time</p>';
        html += '<md-datepicker ng-model="$ctrl.start_date" id="start_date" md-max-date="$ctrl.end_date" md-min-date="$ctrl.creation"></md-datepicker>';
        html += '<input class="time" type="time" id="start_time" name="input" placeholder = "HH:mm:ss" ng-model="$ctrl.start_date" required />';
        html += '</div>';
        html += '<div class="row">';
        html += '<p>End Date and Time</p>';
        html += '<md-datepicker ng-model="$ctrl.end_date" id="end_date" md-min-date="$ctrl.start_date" md-max-date="$ctrl.today"></md-datepicker>';
        html += '<input class="time" type="time" id="end_time" name="input" placeholder = "HH:mm:ss" ng-model="$ctrl.end_date" required />';
        html += '</div>';
        html += '<md-button class="md-raised" ng-click = "$ctrl.getlogs();">Search</md-button>';
        html += '</div>';
        this.param_html += html;
    }

    selectAll() {
        if (this.select === false) {
            for (var i = 0; i < this.all_props.length; i++) {
                document.getElementById(this.all_props[i].name).checked = true;
            }
            this.select = true;
        } else {
            for (var i = 0; i < this.all_props.length; i++) {
                document.getElementById(this.all_props[i].name).checked = false;
            }
            this.select = false;
        }
    }

    getlogs() {
        var chkd_props = [];
        for (var i = 0; i < this.all_props.length; i++) {
            var x = document.getElementById(this.all_props[i].name).checked;
            if (x) {
                chkd_props.push(this.all_props[i]);
            }
        }
        var start_date_unix = this.start_date.getTime();
        if (this.end_date.getTime() === this.today.getTime()) {
            var end_date_unix = this.today.getTime()
        } else {
            var end_date_unix = this.end_date.getTime();
        }
        if (start_date_unix >= end_date_unix) {
            alert("Start Date and Time Must Be Earlier Than End Date and Time");
        } else {
            this.Logging.updateLogParams(this.thng_id, chkd_props, start_date_unix, end_date_unix);
        }
    }

}

export default {
    template: `
      <evtx-widget-base class="without-footer" evt-widget="$ctrl.evtWidget" on-config-change="$ctrl.$onConfigChange()">
        <widget-body layout="column" flex>
          <div class="container">
            <div class="col-sm-3" compile="$ctrl.thng_html"></div>
            <div class="col-sm-9" compile="$ctrl.param_html"></div>
          </div>
        </widget-body>
      </evtx-widget-base>
    `,

    controller: MyLogParamsController,

    bindings: {
        evtWidget: '<'
    },

    defaultConfig: {
        title: {
            required: true,
            value: 'Search Parameters'
        },

        description: {
            required: false,
            value: 'Choose Log Parameters.'
        }
    }
}

angular.module('myModule.components.my-log-params', [])
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