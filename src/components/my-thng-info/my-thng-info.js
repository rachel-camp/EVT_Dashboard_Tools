import './my-thng-info.scss';

export class MyThngInfoController {

    constructor($scope, Support, EVT) {
        "ngInject";
        this.$scope = $scope;
        this.Support = Support;
        this.EVT = EVT;
        this.out_html = '';
        $scope.ctrl = this;


        this.$scope.$watch(Support.getThngs, function (thngs) {
            if (!angular.isUndefined(thngs) && thngs !== null && !angular.isUndefined(thngs[0])) {
                $scope.ctrl.setThngs(thngs);
            } else {
                $scope.ctrl.out_html = '';
            }
        });
    }

    $onDestroy() {
        this.out_html = '';
    }

    setThngs(thngs) {
        this.out_html = '';
        for (var i = 0; i < thngs.length; i++) {
            if (thngs[i].product == 'UFQdDBHwBXsRQpRaa2byXhbh') {
                this.wifiThng(thngs[i]);
            } else if (thngs[i].product == 'U3AtEPrDeg8wtKRRwgry8cdp' || thngs[i].product == 'UFQUDeHwVDPw9pwRwgDpKkck' || thngs[i].product == 'U2QAXeHweXPRtKaaRXDUwbap') {
                this.thermostatThng(thngs[i]);
            } else {
                this.waterHeaterThng(thngs[i]);
            }
        }
    }

    wifiThng(thng) {
        var html = '';
        html += '<div class="col-lg-4 col-sm-6 col-xs-12">';
        html += '<div>';
        html += '<div class="userThng">';
        html += '<img src="http://i.imgur.com/eabltPJ.png">';
        html += '<span class="md-title"> <a href="https://dashboard.evrythng.com/resources/thngs/' + this.nullCheck(thng, 'id') + '" target="_blank">' + this.nullCheck(thng, 'name') + '</a></span>';
        html += '<p class="grey"><span class="md-body-2">Product Type:</span> ' + this.nullCheckCF(thng, 'proddesc') + '</p>';
        html += this.wifiConnected(thng);
        html += '<p class="grey"><span class="md-body-2">MAC Address #:</span> ' + this.nullCheckId(thng, 'mac_address') + '</p>';
        html += '<p><span class="md-body-2">Software Version:</span> ' + this.nullCheckCF(thng, 'sw_versn') + '</p>';
        html += '<p class="grey"><span class="md-body-2">Signal Strength:</span> ' + this.nullCheckProp(thng, 'wifi_signal') + '</p>';
        html += '<p><span class="md-body-2">Serial Number:</span> ' + this.nullCheckId(thng, 'serial_n') + '</p>';
        html += '<p class="grey"><span class="md-body-2">WiFi Name:</span> ' + this.nullCheckProp(thng, 'wf_ssid') + '</p>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        this.out_html += html;
    }

    wifiConnected(thng) {
        var connected = false;
        var outhtml;
        if (thng.hasOwnProperty('tags')) {
            for (var i = 0; i < thng.tags.length; i++) {
                if (thng.tags[i] == "connected") {
                    connected = true;
                }
            }
            if (connected === true) {
                outhtml = '<p><span class="md-body-2">Connected:</span> True</p>';
            } else {
                outhtml = '<p><span class="md-body-2">Connected:</span> False</p>';
            }
        } else {
            outhtml = '<p><span class="md-body-2">Connected:</span> <span class="error">MISSING INFORMATION</span></p>';
        }
        return outhtml;
    }

    thermostatThng(thng) {
        var html = '';
        var alarmnum;
        html += '<div class="col-lg-4 col-sm-6 col-xs-12"';
        html += '<div>';
        html += '<div class="userThng">';
        html += '<img src="http://i.imgur.com/NY3lpdi.png">';
        html += '<span class="md-title"> <a href="https://dashboard.evrythng.com/resources/thngs/' + this.nullCheck(thng, 'id') + '" target="_blank">' + this.nullCheck(thng, 'name') + '</a></span>';
        html += '<p class="grey"><span class="md-body-2">Product Type:</span> ' + this.nullCheckCF(thng, 'proddesc') + '</p>';
        html += '<p><span class="md-body-2">Connected:</span> ' + this.nullCheckProp(thng, 'is_connected') + '</p>';
        html += '<p class="grey"><span class="md-body-2">MAC Address #:</span> ' + this.nullCheckCF(thng, 'wifi_mac_address') + '</p>';
        html += '<p><span class="md-body-2">Software Version:</span> ' + this.nullCheckCF(thng, 'sw_versn') + '</p>';
        html += '<p class="grey"><span class="md-body-2">Heat Set Point:</span> ' + this.nullCheckProp(thng, 'heatsetp') + '</p>';
        html += '<p><span class="md-body-2">Cool Set Point:</span> ' + thng.properties.coolsetp + '</p>';
        html += '<p class="grey"><span class="md-body-2">Vacation Mode Enabled:</span> ' + this.nullCheckProp(thng, 'vacaenab') + '</p>';
        html += '<p><span class="md-body-2">Vacation Cool Set Point:</span> ' + this.nullCheckProp(thng, 'coolvaca') + '</p>';
        html += '<p class="grey"><span class="md-body-2">Vacation Heat Set Point:</span> ' + this.nullCheckProp(thng, 'heatvaca') + '</p>';
        if (this.nullCheckProp(thng, 'alarms') !== '<span class="error">MISSING INFORMATION</span>') {
            html += '<p><span class="md-body-2">Alarms:</span> ' + thng.properties.alarms.length + '</p>';
            if (thng.properties.alarms.length > 0) {
                html += '<div class="grey"';
                html += '<p><span class="md-body-2">Alarm Description:</span> </p>';
                html += '<ul>';
                for (var i = 0; i < thng.properties.alarms.length; i++) {
                    html += '<li>' + thng.properties.alarms[i] + '</li>';
                }
                html += '</ul>';
                html += '</div>';
            }
        } else {
            html += '<p class="grey"><span class="md-body-2">Alarms:</span> <span class="error">MISSING INFORMATION</span></p>';
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
        this.out_html += html;
    }

    waterHeaterThng(thng) {
        var html = '';
        html += '<div class="col-lg-4 col-sm-6 col-xs-12"';
        html += '<div>';
        html += '<div class="userThng">';
        html += '<img src="http://i.imgur.com/skU7WCo.png">';
        html += '<span class="md-title"> <a href="https://dashboard.evrythng.com/resources/thngs/' + this.nullCheck(thng, 'id') + '" target="_blank">' + this.nullCheck(thng, 'name') + '</a></span>';
        html += '<p class="grey"><span class="md-body-2">Product Type:</span> ' + this.nullCheckCF(thng, 'proddesc') + '</p>';
        html += '<p><span class="md-body-2">Connected:</span> ' + this.nullCheckProp(thng, 'is_connected') + '</p>';
        html += '<p class="grey"><span class="md-body-2">Enabled:</span> ' + this.nullCheckProp(thng, 'is_enabled') + '</p>';
        html += '<p><span class="md-body-2">In Use:</span> ' + this.nullCheckProp(thng, 'in_use') + '</p>';
        html += '<p class="grey"><span class="md-body-2">MAC Address #:</span> ' + this.nullCheckCF(thng, 'wifi_mac_address') + '</p>';
        html += '<p><span class="md-body-2">Software Version:</span> ' + this.nullCheckCF(thng, 'sw_versn') + '</p>';
        html += '<p class="grey"><span class="md-body-2">Water Heater Set Point:</span> ' + this.nullCheckProp(thng, 'whtrsetp') + '</p>';
        html += '<p><span class="md-body-2">Configuration:</span> ' + this.nullCheckProp(thng, 'whtrcnfg') + '</p>';
        html += this.vacationWH(thng);
        if (this.nullCheckProp(thng, 'alarms') !== '<span class="error">MISSING INFORMATION</span>') {
            html += '<p><span class="md-body-2">Alarms:</span> ' + thng.properties.alarms.length + '</p>';
            if (thng.properties.alarms.length > 0) {
                html += '<div class="grey"';
                html += '<p><span class="md-body-2">Alarm Description:</span> </p>';
                html += '<ul>';
                for (var i = 0; i < thng.properties.alarms.length; i++) {
                    html += '<li>' + thng.properties.alarms[i] + '</li>';
                }
                html += '</ul>';
                html += '</div>';
            }
        } else {
            html += '<p class="grey"><span class="md-body-2">Alarms:</span> <span class="error">MISSING INFORMATION</span></p>';
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
        this.out_html += html;
    }

    vacationWH(thng) {
        var vaca;
        if (thng.product === 'UmTAeWbmBg8w9Kaaw2sw4bsb' || thng.product === 'UktADVHaBgsw95waaYAKTEkt') {
            vaca = '<p class="grey"><span class="md-body-2">Vacation Mode Enabled:</span> ' + this.nullCheckProp(thng, 'vacation') + '</p>';
        } else {
            vaca = '<p class="grey"><span class="md-body-2">Vacation Mode Enabled:</span> ' + this.nullCheckProp(thng, 'vaca_net') + '</p>';
        }
        return vaca;
    }

    nullCheck(thng, property) {
        var returnObj;
        var msg = 'thng.' + property;
        if (thng.hasOwnProperty(property)) {
            returnObj = eval(msg);
        } else {
            returnObj = '<span class="error">MISSING INFORMATION</span>';
        }
        return returnObj;
    }

    nullCheckCF(thng, property) {
        var returnObj;
        var msg = 'thng.customFields.' + property;
        if (thng.hasOwnProperty('customFields')) {
            if (thng.customFields.hasOwnProperty(property)) {
                returnObj = eval(msg);
            } else {
                returnObj = '<span class="error">MISSING INFORMATION</span>';
            }
        } else {
            returnObj = '<span class="error">MISSING INFORMATION</span>';
        }
        return returnObj;
    }

    nullCheckId(thng, property) {
        var returnObj;
        var msg = 'thng.identifiers.' + property;
        if (thng.hasOwnProperty('identifiers')) {
            if (thng.identifiers.hasOwnProperty(property)) {
                returnObj = eval(msg);
            } else {
                returnObj = '<span class="error">MISSING INFORMATION</span>';
            }
        } else {
            returnObj = '<span class="error">MISSING INFORMATION</span>';
        }
        return returnObj;
    }

    nullCheckProp(thng, property) {
        var returnObj;
        var msg = 'thng.properties.' + property;
        if (thng.hasOwnProperty('properties')) {
            if (thng.properties.hasOwnProperty(property)) {
                returnObj = eval(msg);
            } else {
                returnObj = '<span class="error">MISSING INFORMATION</span>';
            }
        } else {
            returnObj = '<span class="error">MISSING INFORMATION</span>';
        }
        return returnObj;
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

    controller: MyThngInfoController,

    bindings: {
        evtWidget: '<'
    },

    defaultConfig: {
        title: {
            required: true,
            value: 'Thngs'
        },

        description: {
            required: false,
            value: 'This widget shows information on a serched user\'s thngs.'
        }
    }
}

angular.module('myModule.components.my-thng-info', [])
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
