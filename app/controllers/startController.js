(function () {
    'use strict';
    angular.module('mcrutt')
        .controller('startController', startcontroller);
    startcontroller.$inject = ['$state', 'authFactory'];

    function startcontroller($state, authFactory) {
        /* jshint validthis:true */
        var vm = this;
        vm.date = new Date();

        activate();

        function activate() {
            if (authFactory.IsAuthorized())
                $state.go('home');
        }
    }
})();