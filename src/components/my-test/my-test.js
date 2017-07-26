import './my-test.scss';

export class MyTestController {

    constructor(Support, EVT) {
        "ngInject";
        this.Support = Support;
        this.EVT = EVT;
        this.searchType = 'E-mail';
        this.all_locations = [];
        this.all_users = [];
    }

    $onDestroy() {
        this.thngOut(null, null);
        this.searchType = 'E-mail';
        this.all_locations = [];
        this.all_users = [];
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
                this.all_users.push(user)
                this.thngOut(this.all_users, collection);
            });
        } else {
            this.thngOut(user, null);
        }
    }

    thngOut(user, location) {
        this.Support.updateSupport(user, location);
        this.all_locations = [];
        this.all_users = [];
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
                this.getLocations(thngs);
            });
        } else {
            this.thngOut(null, null);
        }
    }

    getLocations(thngs) {
        this.location_ids = [];
        for (var i = 0; i < thngs.length; i++) {
            var match = false;
            for (var j = 0; j < this.location_ids.length; j++) {
                if (thngs[i].identifiers.location_id === this.location_ids[j]) {
                    match = true;
                }
            }
            if (match === false) {
                this.location_ids.push(thngs[i].identifiers.location_id);
            }
        }
        this.location_back = 0;
        if (this.location_ids.length !== 0) {
            for (var i = 0; i < this.location_ids.length; i++) {
                this.EVT.operator.collection(this.location_ids[i]).read().then(collection => {
                    this.addLocations(collection);
                });
            }
        } else {
            this.thngOut(null, null);
        }
    }

    addLocations(location) {
        this.all_locations.push(location);
        this.location_back++;
        if (this.location_back === this.location_ids.length) {
            this.getUser();
        }
    }

    getUser() {
        this.user_ids = [];
        for (var i = 0; i < this.all_locations.length; i++) {
            var match = false;
            for (var j = 0; j < this.user_ids.length; j++) {
                if (this.all_locations[i].identifiers.user_id === this.user_ids[j]) {
                    match = true;
                }
            }
            if (match === false) {
                this.user_ids.push(this.all_locations[i].identifiers.user_id);
            }
        }
        this.user_back = 0;
        if (this.user_ids.length !== 0) {
            for (var i = 0; i < this.user_ids.length; i++) {
                this.EVT.operator.user(this.user_ids[i]).read().then(user => {
                    this.addUser(user);
                });
            }
        } else {
            this.thngOut(null, null);
        }
    }

    addUser(user) {
        this.all_users.push(user);
        this.user_back++;
        if (this.user_back === this.location_ids.length) {
            this.thngOut(this.all_users, this.all_locations);
        }
    }

}

export default {
    template: `
        <md-toolbar>
          <div class="md-toolbar-tools" layout-align="center center">
            <img src="http://i.imgur.com/7Vt6hJv.png" layout-align="center center">
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
    controller: MyTestController
};
