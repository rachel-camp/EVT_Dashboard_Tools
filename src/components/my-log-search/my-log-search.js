import './my-log-search.scss';

export class MyLogSearchController {

    constructor(Logging, EVT) {
        "ngInject";
        this.Logging = Logging;
        this.EVT = EVT;
        this.searchType = 'E-mail';
    }

    $onDestroy() {
        this.Logging.updateThngs(null);
    }

    search(email) {
        return this.EVT.operator.user().read({
            params: {
                filter: 'email=' + email + '*'
            }
        });
    }

    updateSearch(user) {
        if (!angular.isUndefined(user) && user.id != null) {
            this.EVT.operator.collection().read({
                params: {
                    filter: 'identifiers.user_id=' + user.id
                }
            }).then(collection => {
                this.searchThngs(collection);
            });
        } else {
            this.Logging.updateThngs(null);
        }
    }

    searchThngs(thngID) {
        if (!angular.isUndefined(thngID) && thngID.length !== 0) {
            this.EVT.operator.thng().read({
                params: {
                    filter: 'identifiers.location_id=' + thngID[0].id
                }
            }).then(thngs => {
                this.Logging.updateThngs(thngs);
            });
        } else {
            this.Logging.updateThngs(null);
        }
    }

    changeSearch() {
        this.searchType = document.getElementById("searchType").value;
    }

    searchMac() {
        var mac = document.getElementById("macAddress").value.toUpperCase();
        if (!angular.isUndefined(mac) && mac !== null) {
            this.EVT.operator.thng().read({
                params: {
                    filter: 'tags=' + mac
                }
            }).then(thngs => {
              this.Logging.updateThngs(thngs);
            });
        } else {
            this.Logging.updateThngs(null);
        }
    }

}

export default {
    template: `
     <md-toolbar>
      <div class="md-toolbar-tools" layout-align="center center" ">
        <div class="search-icon mdi mdi-filter-variant"></div>
            <md-autocomplete ng-if="$ctrl.searchType === 'E-mail'"
              flex="60"
              md-search-text="$ctrl.searchText"
              md-items="item in $ctrl.search($ctrl.searchText)"
              md-selected-item-change="$ctrl.updateSearch(item)"
              md-item-text="item.email"
              placeholder="Search for users by email"
              md-min-length="0">
              <md-item-template>
                <span md-highlight-text="$ctrl.searchText" md-highlight-flags="^i">{{item.email}}</span>
              </md-item-template>
            </md-autocomplete>
              <form ng-if="$ctrl.searchType === 'MAC Address'" flex="50"  ng-submit="$ctrl.searchMac();">
                <input type="text" id="macAddress" placeholder="Search for thngs by MAC address"/>
              </form>
            </md-input-container>
            <md-button ng-if="$ctrl.searchType === 'MAC Address'" class="md-raised" ng-click = "$ctrl.searchMac();">Search</md-button>
            <select id="searchType" ng-click="$ctrl.changeSearch()">
              <option value="E-mail">E-mail</option>
              <option value="MAC Address">MAC Address</option>
            </select>
         </div>
        </md-toolbar>
  `,
    controller: MyLogSearchController,

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
}

angular.module('myModule.components.my-log-search', [])
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
