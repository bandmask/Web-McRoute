(function () {
    'use strict';
    angular.module('mcrutt')
        .factory('authFactory', authfactory);

    authfactory.$inject = ['$resource', '$http', '$rootScope', '$state', '$q', 'localStorageService', '$timeout', 'ngAuthSettings'];

    function authfactory($resource, $http, $rootScope, $state, $q, localStorageService, $timeout, ngAuthSettings) {
        var _authFactory = {};

        var _authentication = {
            isAuth: false,
            userName: "",
            useRefreshTokens: false,
            roles: ""
        };

        var _externalAuthData = {
            provider: "",
            userName: "",
            refreshToken: ""
        };

        var _authorize = function () {
            var isAuthenticated = _authentication.isAuth;
            if ($rootScope.toState.data && $rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !_isInAnyRole($rootScope.toState.data.roles)) {
                if (isAuthenticated) {
                    $timeout(function () { $state.go('accessdenied'); }); // user is signed in but not authorized for desired state
                    return false;
                } else {
                    $rootScope.returnToState = $rootScope.toState;
                    $rootScope.returnToStateParams = $rootScope.toStateParams;
                    $rootScope.errorMessage = 'You have to login to reach this page';
                    $state.go('login');
                    return false;
                }
            }
            return true;
        }

        var _isInAnyRole = function (roles) {
            if (!_authentication.isAuth || !_authentication.roles) return false;

            for (var i = 0; i < roles.length; i++) {
                if (_isInRole(roles[i])) return true;
            }
            return false;
        }

        var _isInRole = function (role) {
            if (!_authentication.isAuth || !_authentication.roles) return false;

            return _authentication.roles.indexOf(role) != -1;
        }

        var _fillAuthData = function () {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.useRefreshTokens = authData.useRefreshTokens;
                _authentication.roles = authData.roles;
            }
        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.useRefreshTokens = false;
            _authentication.roles = "";

        };

        var _refreshToken = function () {
            var deferred = $q.defer();
            var authData = localStorageService.get('authorizationData');

            if (authData) {
                if (authData.useRefreshTokens) {
                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId + "&client_secret=" + ngAuthSettings.clientSecret;
                    localStorageService.remove('authorizationData');
                    $http.post('/api/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                        localStorageService.set('authorizationData', { userName: response.userName, token: response.access_token, refreshToken: response.refresh_token, useRefreshTokens: true, user_id: authData.user_id, profileId: authData.profileId, roles: authData.roles });
                        deferred.resolve(response);
                    }).error(function (err) {
                        _logOut();
                        deferred.reject(err);
                    });
                }
            }
            return deferred.promise;
        };

        var _setInternalUser = function () {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.useRefreshTokens = true;
                _authentication.roles = authData.roles;
            }
        }

        var _isAuthorized = function () {
            return _authentication.isAuth;
        };

        _authFactory.IsAuthorized = _isAuthorized;
        _authFactory.logOut = _logOut;
        _authFactory.authorize = _authorize;
        _authFactory.fillAuthData = _fillAuthData;
        _authFactory.authentication = _authentication;
        _authFactory.refreshToken = _refreshToken;
        _authFactory.externalAuthData = _externalAuthData;
        _authFactory.setInternalUser = _setInternalUser;

        return _authFactory;
    }
})();