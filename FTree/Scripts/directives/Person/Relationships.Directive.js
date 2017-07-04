(function () {

    angular.module("app").directive("personRelationships", personRelationshipsDirective);
    function personRelationshipsDirective() {
        var controller = function ($scope, $element) {
            //update children
            $scope.data.Children = toArray($scope.data.Children);
            //update spouses
            $scope.data.Spouses = toArray($scope.data.Spouses);
        }

        return {
            controller: controller,
            restrict: "E",
            scope: {
                mode: "@",
                data: "=",
                add: "&",
                toggle: "&"
            },
            templateUrl: "/templates/person/Relationships.html"
        };
    }

})()