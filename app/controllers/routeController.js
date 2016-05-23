(function() {
    'use strict';
    angular.module('mcrutt')
        .controller('routeController', routecontroller);

    routecontroller.$inject = ['$sce', 'route', 'uiGmapGoogleMapApi'];

    function routecontroller($sce, route, uiGmapGoogleMapApi) {
        /* jshint validthis:true */
        var vm = this;

        vm.route = route;
        vm.route.text = $sce.trustAsHtml(vm.route.text);

        uiGmapGoogleMapApi.then(function() {
            configureMap();
        });

        function configureMap() {
            if (vm.route && vm.route.routings && vm.route.routings.length > 0) {
                var routings = vm.route.routings;
                vm.map = { center: { latitude: routings[0].latitude, longitude: routings[0].longitude }, zoom: 15, isSet: true };
                vm.startMarker = {
                    id: 0,
                    coords: {
                        latitude: routings[0].latitude,
                        longitude: routings[0].longitude
                    },
                    options: { icon: '/Content/Images/Routes/startFlag.png' }
                };
                vm.endMarker = {
                    id: 1,
                    coords: {
                        latitude: routings[routings.length - 1].latitude,
                        longitude: routings[routings.length - 1].longitude
                    },
                    options: { icon: '/Content/Images/Routes/goalFlag.png' }
                };
                if (routings.length > 2) {
                    var path = [];
                    routings.forEach(function(routing) {
                        path.push({
                            latitude: routing.latitude,
                            longitude: routing.longitude
                        });
                    });
                    vm.polylines = [
                        {
                            id: 1,
                            path: path,
                            stroke: {
                                color: '#6060FB',
                                weight: 3
                            },
                            editable: false,
                            draggable: false,
                            geodesic: false,
                            visible: true
                        }
                    ];
                }
            } else {
                vm.map = { isSet: false };
            }
        }
    }
})();