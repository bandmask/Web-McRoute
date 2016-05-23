(function () {
    'use strict';
    angular.module('mcrutt')
        .controller('userController', usercontroller);

    usercontroller.$inject = ['ngToast', 'profileFactory', 'userProfile'];

    function usercontroller(ngToast, profileFactory, userProfile) {
        /* jshint validthis:true */
        var vm = this;

        vm.save = save;
        vm.userProfile = userProfile;

        function save () {
            profileFactory.updateProfile(vm.userProfile).then(function () {
                ngToast.create({
                    className: 'success',
                    content: '<p>Update successful</p>',
                    dismissOnTimeout: true,
                    timeout: 1400,
                    additionalClasses: 'center-toast',
                    maxNumber: 1
                });

                vm.edit = false;
            }, function () {
                ngToast.create({
                    className: 'warning',
                    content: '<p>Update unsuccessful</p>',
                    dismissOnTimeout: true,
                    timeout: 1400,
                    additionalClasses: 'center-toast',
                    maxNumber: 1
                });
            });
        }
    }
})();