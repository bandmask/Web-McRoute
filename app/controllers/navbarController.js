(function () {
    'use-strict';
    angular.module('mcrutt')
        .controller('navbarController', navbarcontroller);

    navbarcontroller.$inject = ['$state', 'authFactory', 'userProfile'];

    function navbarcontroller($state, authFactory, userProfile) {
        /* jshint validthis:true */
        var vm = this;

        activate();

        function activate() {
            authFactory.setInternalUser();
            vm.authentication = authFactory.authentication;
            vm.userProfile = userProfile;
        }
    }
})();