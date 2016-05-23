(function () {
    'use strict';
    angular.module('mcrutt')
        .controller('loginController', logincontroller);

    logincontroller.$inject = ['$scope', '$rootScope', '$state', 'authFactory', 'localStorageService', 'ngAuthSettings'];

    function logincontroller($scope, $rootScope, $state, authFactory, localStorageService, ngAuthSettings) {
        /* jshint validthis:true */
        var vm = this;

        vm.errorMessage = $rootScope.errorMessage;
        vm.authExternal = authExternal;
        vm.authCompletedCB = authCompletedCB;
        
        function authExternal(provider) {

            var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';
            var client = ngAuthSettings.clientId;
            var clientSecret = ngAuthSettings.clientSecret;

            var externalProviderUrl = "api/Account/ExternalLogin?provider=" + provider
                + "&response_type=token"
                + "&client_id=" + client
                + "&redirect_uri=" + redirectUri
                + "&client_secret=" + clientSecret;
            window.$windowScope = vm;

            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        }

        function authCompletedCB (fragments) {
            $scope.$apply(function () {

                if (fragments.haslocalaccount == "False") {

                    authFactory.logOut();

                    authFactory.externalAuthData = {
                        provider: fragments.provider,
                        userName: fragments.external_user_name,
                        refreshToken: fragments.refresh_token
                    };

                    $state.go('associate');

                } else if (fragments.internal_userid) {
                    localStorageService.set('authorizationData', { userName: fragments.external_user_name, token: fragments.access_token, refreshToken: fragments.refresh_token, useRefreshTokens: true, user_id: fragments.internal_userid });

                    authFactory.externalAuthData = {
                        provider: fragments.provider,
                        userName: fragments.external_user_name,
                        refreshToken: fragments.refresh_token,
                        accessToken: fragments.access_token,
                        userId: fragments.internal_userid
                    };

                    authFactory.setInternalUser();
                    $state.go('home');
                }
            });
        }
    }
})();