(function () {
    'use strict';
    angular.module('mcrutt')
        .controller('logoutController', logoutcontroller);

    logoutcontroller.$inject = ['$scope', '$timeout', '$state', '$interval', 'authFactory', '$rootScope'];

    function logoutcontroller($scope, $timeout, $state, $interval, authFactory, $rootScope) {
        /* jshint validthis:true */
        var vm = this;
        activate();

        function activate() {
            authFactory.logOut();

            if ($rootScope.$stateParams.message)
                vm.message = $rootScope.$stateParams.message;

            vm.redirectTimer = 5;
            var startTimer = $interval(function() {
                vm.redirectTimer--;
                if (vm.redirectTimer == 0)
                    $state.go('start');
            }, 1000);

            $scope.$on('$destroy', function() {
                $interval.cancel(startTimer);
            });
        }
    }
})();