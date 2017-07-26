import './my-location-info.scss';

export class MyLocationInfoController {

    constructor($scope, Support, EVT) {
        "ngInject";
        this.$scope = $scope;
        this.Support = Support;
        this.EVT = EVT;
        this.out_html = '';
        this.location_ids = [];
        $scope.ctrl = this;

        this.$scope.$watch(Support.getLocations, function (locations) {
            if (!angular.isUndefined(locations) && locations !== null && !angular.isUndefined(locations[0])) {
                $scope.ctrl.setLocations(locations);
            } else {
                $scope.ctrl.out_html = '';
                $scope.ctrl.thngOut(null);
            }
        });
    }

    $onDestroy() {
        this.out_html = '';
        this.location_ids = [];
    }

    setLocations(locations) {
        this.location_ids = [];
        var html = '';
        for (var i = 0; i < locations.length; i++) {
            html += '<div class="col-lg-6 col-md-12"';
            html += '<div>';
            html += '<div class="userThng">';
            html += '<md-button class="md-raised" ng-click = "$ctrl.searchThngs($ctrl.location_ids[' + i + ']);">' + this.nullCheck(locations[i], 'name') + '</md-button>';
            html += '<p><span class="md-body-2">City, State/Province:</span> ' + this.nullCheckAdress(locations[i], 'city') + ', ' + this.nullCheckAdress(locations[i], 'state') + '</p>';
            html += '<p><span class="md-body-2">ZIP/Postal Code:</span> ' + this.nullCheckAdress(locations[i], 'postalCode') + '</p>';
            if (locations[i].customFields.timezone_gmt_offset < 0) {
                html += '<p><span class="md-body-2">Time Zone:</span> GMT' + locations[i].customFields.timezone_gmt_offset + '</p>';
            } else if (locations[i].customFields.timezone_gmt_offset > 0) {
                html += '<p><span class="md-body-2">Time Zone:</span> GMT+' + locations[i].customFields.timezone_gmt_offset + '</p>';
            } else if (locations[i].customFields.timezone_gmt_offset === 0) {
                html += '<p><span class="md-body-2">Time Zone:</span> GMT</p>';
            } else {
                html += '<p><span class="md-body-2">Time Zone:</span> <span class="error">MISSING INFORMATION</span></p>';
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';
            this.location_ids.push(locations[i].id);
        }
        this.out_html = html;
    }

    nullCheck(location, property) {
        var returnObj;
        var msg = 'location.' + property;
        if (location.hasOwnProperty(property)) {
            returnObj = eval(msg);
        } else {
            returnObj = '<span class="error">MISSING INFORMATION</span>';
        }
        return returnObj;
    }

    nullCheckCF(location, property) {
        var returnObj;
        var msg = 'location.customFields.' + property;
        if (location.hasOwnProperty('customFields')) {
            if (location.customFields.hasOwnProperty(property)) {
                returnObj = eval(msg);
            } else {
                returnObj = '<span class="error">MISSING INFORMATION</span>';
            }
        } else {
            returnObj = '<span class="error">MISSING INFORMATION</span>';
        }
        return returnObj;
    }

    nullCheckAdress(location, property) {
        var returnObj;
        var msg = 'location.customFields.address.' + property;
        if (location.hasOwnProperty('customFields')) {
            if (location.customFields.hasOwnProperty('address')) {
                if (location.customFields.address.hasOwnProperty(property)) {
                    returnObj = eval(msg);
                } else {
                    returnObj = '<span class="error">MISSING INFORMATION</span>';
                }
            } else {
                returnObj = '<span class="error">MISSING INFORMATION</span>';
            }
        } else {
            returnObj = '<span class="error">MISSING INFORMATION</span>';
        }
        return returnObj;
    }

    searchThngs(thngID) {
        this.EVT.operator.thng().read({
            params: {
                filter: 'identifiers.location_id=' + thngID
            }
        }).then(thngs => {
            this.thngOut(thngs);
        });
    }

    thngOut(thngs) {
        this.Support.updateThngs(thngs);
    }

}

export default {
    template: `
      <evtx-widget-base class="without-footer" evt-widget="$ctrl.evtWidget" on-config-change="$ctrl.$onConfigChange()">
        <widget-body layout="column" flex>
          <div compile="$ctrl.out_html"></div>
        </widget-body>
      </evtx-widget-base>
     `,

    controller: MyLocationInfoController,

    bindings: {
        evtWidget: '<'
    },

    defaultConfig: {
        title: {
            required: true,
            value: 'Locations'
        },

        description: {
            required: false,
            value: 'This widget shows information on a serched user\'s locations.'
        }
    }
}

angular.module('myModule.components.my-location-info', [])
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
