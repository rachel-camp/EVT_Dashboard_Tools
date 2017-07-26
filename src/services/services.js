import Support from './support/support';
import Logging from './logging/logging';

export default angular.module('myModule.services', [])
    .factory('Support', Support)
    .factory('Logging', Logging);

