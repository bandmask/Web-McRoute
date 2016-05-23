(function () {
    'use strict';
    angular.module('mcrutt')
        .directive('viewRoute', viewroute);

    viewroute.$inject = ['$sce'];

    function viewroute($sce) {
        return {
            restrict: 'E',
            templateUrl: 'Scripts/app/views/route/routedisplay.html',
            scope: {
                route: '='
            },
            controller: function ($scope) {
                $scope.route.escapedText = $sce.trustAsHtml($scope.route.text);
                if ($scope.route && $scope.route.routings && $scope.route.routings.length > 0) {
                    var routings = $scope.route.routings;
                    $scope.map = { center: { latitude: routings[0].latitude, longitude: routings[0].longitude }, zoom: 15, isSet: true, style: "height: 150px; width: 100%; display: block;" };
                    $scope.startMarker = {
                        id: 0,
                        coords: {
                            latitude: routings[0].latitude,
                            longitude: routings[0].longitude
                        },
                        options: { icon: '/Content/Images/Routes/startFlag.png' }
                    };
                    $scope.endMarker = {
                        id: 1,
                        coords: {
                            latitude: routings[routings.length - 1].latitude,
                            longitude: routings[routings.length - 1].longitude
                        },
                        options: { icon: '/Content/Images/Routes/goalFlag.png' }
                    };
                    if (routings.length > 2) {
                        var path = [];
                        routings.forEach(function (routing) {
                            path.push({
                                latitude: routing.latitude,
                                longitude: routing.longitude
                            });
                        });
                        $scope.polylines = [
                            {
                                id: 1,
                                path: path,
                                stroke: {
                                    color: '#6060FB',
                                    weight: 3
                                },
                                editable: false,
                                draggable: false,
                                geodesic: false
                            }
                        ];
                    }
                } else {
                    $scope.map = { isSet: false };
                }
            }
        };
    }
})();