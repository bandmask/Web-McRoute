(function () {
    'use-strict';
    angular.module('mcrutt')
        .controller('homeController', homecontroller);

    homecontroller.$inject = ['authFactory', 'routeFactory', 'userProfile'];

    function homecontroller(authFactory, routeFactory, userProfile) {
        /* jshint validthis:true */
        var vm = this;
        vm.authentication = authFactory.authentication;
        vm.userProfile = userProfile;

        activate();

        function activate() {
            routeFactory.getProfileRoutes(userProfile.id).then(function (data) {
                vm.userProfile.routes = data;
            });
        }
    }
})();