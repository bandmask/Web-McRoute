(function () {
    'use strict';
    angular.module('mcrutt')
        .factory('authInterceptorService', interceptfactory);

    interceptfactory.$inject = ['$q', '$injector', '$rootScope', 'localStorageService'];

    function interceptfactory($q, $injector, $rootScope, localStorageService) {

        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }

            return config;
        }

        var _responseError = function (rejection) {
            var authFactory = $injector.get('authFactory');

            if (rejection.status === 401) {
                var authData = localStorageService.get('authorizationData');
                var deffered = $q.defer();
                if (authData) {
                    if (authData.useRefreshTokens) {
                        authFactory.refreshToken().then(function (response) {
                            $injector.get("$http")(rejection.config).then(function (retryResponse) {
                                deffered.resolve(retryResponse);
                            }, function (err) {
                                deffered.reject(err);
                            });
                        }, function (err) {
                            deffered.reject(err);
                        });
                        return deffered.promise;
                    }
                }
                authFactory.logOut();
                $rootScope.$state.go('login');
            } else if (rejection.status === 400) {
                //$rootScope.toStateParams.message = "Invalid Session";
                $rootScope.$state.go('logout', { message: "Invalid Session" });
            }
            return $q.reject(rejection);
        }

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }
})();