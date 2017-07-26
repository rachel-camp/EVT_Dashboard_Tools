import myTest from './my-test/my-test';
import myUserInfo from './my-user-info/my-user-info';
import myLocationInfo from './my-location-info/my-location-info';
import myThngInfo from './my-thng-info/my-thng-info';
import myLogSearch from './my-log-search/my-log-search';
import myLogParams from './my-log-params/my-log-params';
import myLogResults from './my-log-results/my-log-results';
import myDetectionTool from './my-detection-tool/my-detection-tool';

export default angular.module('myModule.components', [])
    .component('myTest', myTest)
    .component('myUserInfo', myUserInfo)
    .component('myLocationInfo', myLocationInfo)
    .component('myThngInfo', myThngInfo)
    .component('myLogSearch', myLogSearch)
    .component('myLogParams', myLogParams)
    .component('myLogResults', myLogResults)
    .component('myDetectionTool', myDetectionTool)
    .config(WidgetsProvider => {
        'ngInject';

        WidgetsProvider.register('myUserInfo', myUserInfo);
        WidgetsProvider.register('myLocationInfo', myLocationInfo);
        WidgetsProvider.register('myThngInfo', myThngInfo);
        WidgetsProvider.register('myLogSearch', myLogSearch);
        WidgetsProvider.register('myLogParams', myLogParams);
        WidgetsProvider.register('myLogResults', myLogResults);
        WidgetsProvider.register('myDetectionTool', myDetectionTool);
    });