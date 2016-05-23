(function() {
    'use strict';
    angular.module('mcrutt', [
        'ui.router',
        'angular-loading-bar',
        'ngAnimate',
        'ngSanitize',
        'ngResource',
        'LocalStorageModule',
        'uiGmapgoogle-maps',
        'ngToast'
    ]).constant('ngAuthSettings', {
        clientId: 'mcrutt.se',
        clientSecret: 'hejhej123'
    });
})();