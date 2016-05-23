(function () {
    'use strict';

    angular.module('mcrutt')
        .config(mainconfig);

    mainconfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function mainconfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'statebar@': { templateUrl: 'app/shared/statebar.html' }
            }
        }).state('unauthed', {
            parent: 'site',
            'abstract': true,
            views: {
                '@': { template: '<div ui-view></div>' },
                'startbutton@': {
                    template: '<a ui-sref="start" class="navbar-brand main-title" id="header">McRutt.se</a>'
                },
                'navbar@': {
                    templateUrl: 'app/shared/unauthednavbar.html'
                }
            }
        }).state('start', {
            parent: 'unauthed',
            url: '/',
            data: {
                roles: []
            },
            views: {
                '': {
                    templateUrl: 'app/start.html',
                    controller: 'startController',
                    controllerAs: 'vm'
                }
            }
        }).state('notfoundunauthed', {
            parent: 'unauthed',
            url: '/notfound',
            views: {
                '': { templateUrl: 'app/shared/errors/notfound.html' }
            }
        }).state('login', {
            parent: 'unauthed',
            url: '/login',
            data: {
                roles: []
            },
            templateUrl: 'app/auth/login.html',
            controller: 'loginController',
            controllerAs: 'vm'
        }).state('authed', {
            parent: 'site',
            'abstract': true,
            resolve: {
                userProfile: [
                    'profileFactory', 'authFactory', 'localStorageService', function (profileFactory, authFactory, localStorageService) {
                        var authData = localStorageService.get('authorizationData');
                        if (authData && authData.profileId)
                            return profileFactory.getProfileById(authData.profileId);
                        else if (authFactory.externalAuthData.userId)
                            return profileFactory.getProfileByUserId(authFactory.externalAuthData.userId);
                    }
                ]
            },
            views: {
                '@': { template: '<div ui-view></div>' },
                'startbutton@': { template: '<a ui-sref="home" class="navbar-brand main-title" id="header">McRutt.se</a>' },
                'navbar@': {
                    templateUrl: 'app/shared/authednavbar.html',
                    controller: 'navbarController',
                    controllerAs: 'vm'
                }
            }
        }).state('accessdenied', {
            parent: 'authed',
            url: '/denied',
            templateUrl: 'app/shared/accessdenied.html'
        }).state('notfoundauthed', {
            parent: 'authed',
            url: '/notfound',
            templateUrl: 'app/shared/errors/notfound.html'
        }).state("logout", {
            parent: 'unauthed',
            url: '/logout/:message',
            data: {
                roles: ['user']
            },
            templateUrl: 'app/auth/logout.html',
            controller: 'logoutController',
            controllerAs: 'vm'
        }).state('home', {
            parent: 'authed',
            url: '/home',
            templateUrl: 'app/home/home.html',
            controller: 'homeController',
            controllerAs: 'vm'
        }).state('useradmin', {
            parent: 'authed',
            url: '/user',
            data: {
                roles: ['user']
            },
            templateUrl: 'app/home/useradmin.html',
            controller: 'userController',
            controllerAs: 'vm'
        }).state('route', {
            parent: 'authed',
            'abstract': true,
            url: '/route/:id',
            data: {
                roles: ['user']
            },
            resolve: {
                route: [
                    'routeFactory', '$stateParams', function (routeFactory, $stateParams) {
                        return routeFactory.get($stateParams.id);
                    }
                ]
            },
            templateUrl: 'app/route/viewroutedetails.html',
            controller: 'routeController',
            controllerAs: 'vm'
        }).state('route.map', {
            url: '/map',
            templateUrl: 'app/route/viewroutedetailsmap.html'
        }).state('route.photos', {
            url: '/photos',
            templateUrl: 'app/route/viewroutedetailsphotos.html'
        });
    }

    angular.module('mcrutt')
        .config(authinjector);

    authinjector.$inject = ['$httpProvider'];

    function authinjector($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    }

    angular.module('mcrutt').config(toastprovider);

    toastprovider.$inject = ['ngToastProvider'];

    function toastprovider(ngToastProvider) {
        ngToastProvider.configure({
            animation: 'fade',
            verticalPosition: 'top',
            horizontalPosition: 'center'
        });
    }

    function googleMapProvider(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyBsLwal-jS2zt9rQArttjSJADtSP0N-OT4'
        });
    }

    angular.module('mcrutt').run(runner);

    runner.$inject = ['$rootScope', '$state', '$stateParams', 'authFactory'];

    function runner($rootScope, $state, $stateParams, authFactory) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {
            $rootScope.fromState = fromState;
            $rootScope.fromStateParams = fromStateParams;
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (!authFactory.authorize())
                event.preventDefault();
        });
        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            if (authFactory.IsAuthorized())
                $state.go('notfoundauthed');
            else
                $state.go('notfoundunauthed');
        });
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            //Handle error
        });

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        authFactory.fillAuthData();
    }

    angular.module('mcrutt')
        .config(loadingBarConfig);

    loadingBarConfig.$inject = ['cfpLoadingBarProvider'];

    function loadingBarConfig(loadingBarProvider) {
        loadingBarProvider.includeSpinner = true;
    }
})();