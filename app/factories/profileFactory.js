(function () {
    'use strict';
    angular.module('mcrutt')
        .factory('profileFactory', profilefactory);

    profilefactory.$inject = ['$http', '$q', '$state', 'localStorageService'];

    function profilefactory($http, $q, $state, localStorageService) {
        var profileFactory = {};

        var _getProfileById = function (profileId) {
            var deffered = $q.defer();
            $http.get('api/profile/GetProfileById?id=' + profileId).success(function (response) {
                handleProfileResponse(response);
                deffered.resolve(response);
            }).error(function (err) {
                deffered.reject(err);
            });

            return deffered.promise;
        }

        var _getProfileByUserId = function (userId) {
            var deffered = $q.defer();
            $http.get('api/profile/GetProfileByUserId?userId=' + userId).success(function (response) {
                handleProfileResponse(response);
                deffered.resolve(response);
            }).error(function (err) {
                deffered.reject(err);
            });

            return deffered.promise;
        }

        var _updateProfile = function (profile) {
            var deffered = $q.defer();
            $http.put('api/profile', profile).then(function (response) {
                deffered.resolve(response);
            }, function (err) {
                deffered.reject(err);
            });

            return deffered.promise;
        }

        function handleProfileResponse(response) {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                localStorageService.remove('authorizationData');
                authData.profileId = response.id;
                authData.roles = "";
                response.roles.forEach(function (x) {
                    authData.roles += x.roleName + " ";
                });
                localStorageService.set('authorizationData', authData);
            }
        }

        profileFactory.getProfileByUserId = _getProfileByUserId;
        profileFactory.getProfileById = _getProfileById;
        profileFactory.updateProfile = _updateProfile;
        return profileFactory;
    }
})();