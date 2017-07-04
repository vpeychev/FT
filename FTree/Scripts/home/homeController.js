; (function () {
    'use strict';
    angular.module("app").controller("HomeController", ["$scope", "$window", "HomeService", homeController]);

    function homeController($scope, $window, HomeService) {
        var controller = this;

        controller.data = HomeService.getData();
        controller.events = HomeService.events;

        $scope.$watch(
            function () { return controller.data.searchValue; },        //"searchVal",
            function () { controller.events.search($scope); }, 
            true
        );
    };

})()