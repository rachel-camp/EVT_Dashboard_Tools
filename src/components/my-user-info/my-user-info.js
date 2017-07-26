import './my-user-info.scss';

export class MyUserInfoController {

    constructor($scope, Support, EVT) {
        "ngInject";
        this.$scope = $scope;
        this.Support = Support;
        this.EVT = EVT;
        this.out_html = '';
        $scope.ctrl = this;


        this.$scope.$watch(Support.getUser, function (user) {
            if (angular.isUndefined(user) == false) {
                $scope.ctrl.setUser(user);
            } else {
                $scope.ctrl.out_html = '';
            }
        });
    }

    $onDestroy() {
        this.out_html = '';
    }

    $onConfigChange() {
        _.forOwn(this.map.markers, marker => marker.icon = this.getIcon());
    }

    setUser(user) {
        if (!angular.isUndefined(user) && user !== null) {
            var html = '';
            for (var i = 0; i < user.length; i++) {
                html += '<div class="col-lg-6 col-md-12"';
                html += '<p><span class="md-body-2">Name:</span> ' + this.nullCheck(user[i], 'firstName') + ' ' + this.nullCheck(user[i], 'lastName') + '</p>';
                html += '<p><span class="md-body-2">E-mail:</span> ' + this.nullCheck(user[i], 'email') + '</p>';
                html += '<p><span class="md-body-2">Temparature Display:</span> ' + this.nullCheckCF(user[i], 'temperatureDisplayUnit') + '</p>';
                html += '</div>';
            }
            this.out_html += html;
        } else {
            this.out_html = '';
        }
    }

    nullCheck(user, property) {
        var returnObj;
        var msg = 'user.' + property;
        if (user.hasOwnProperty(property)) {
            returnObj = eval(msg);
        } else {
            returnObj = '<span><span><span class="error">MISSING INFORMATION </span></span></span>';
        }
        return returnObj;
    }

    nullCheckCF(user, property) {
        var returnObj;
        var msg = 'user.customFields.' + property;
        if (user.hasOwnProperty('customFields')) {
            if (user.customFields.hasOwnProperty(property)) {
                returnObj = eval(msg);
            } else {
                returnObj = '<span><span class="error">MISSING INFORMATION </span></span>';
            }
        } else {
            returnObj = '<span><span class="error">MISSING INFORMATION </span></span>';
        }
        return returnObj;
    }

}

export default {
    template: `
      <evtx-widget-base class="without-footer" evt-widget="$ctrl.evtWidget" on-config-change="$ctrl.$onConfigChange()">
        <widget-body layout="column" flex>
          <p ng-bind-html="$ctrl.out_html"></p>
        </widget-body>
      </evtx-widget-base>
    `,

    controller: MyUserInfoController,

    bindings: {
        evtWidget: '<'
    },

    defaultConfig: {
        title: {
            required: true,
            value: 'User'
        },

        description: {
            required: false,
            value: 'This widget shows information on a serched user.'
        }
    }
};
