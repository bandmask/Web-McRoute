(function () {
    'use strict';
    angular.module('mcrutt')
        .factory('routeFactory', routefactory);

    routefactory.$inject = ['$http', '$q'];

    function routefactory($http, $q) {
        var profileFactory = {};

        var _getProfileRoutes = function (profileId) {
            var defferred = $q.defer();
            $http.get('api/mcroute/GetByProfileId?profileId=' + profileId).success(function (response) {
                defferred.resolve(response);
            }).error(function (response) {
                defferred.reject(response);
            });
            return defferred.promise;
        }

        var _get = function (id) {
            var defferred = $q.defer();
            $http.get('api/mcroute?id=' + id).success(function (response) {
                defferred.resolve(response);
            }).error(function (response) {
                defferred.resolve(response);
            });

            return defferred.promise;
        }

        profileFactory.getProfileRoutes = _getProfileRoutes;
        profileFactory.get = _get;
        return profileFactory;
    }
})();