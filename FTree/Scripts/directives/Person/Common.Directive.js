(function () {

    angular.module("app").directive("personCommon", personCommonDirective);
    function personCommonDirective() {
        var controller = function ($scope, $element) {
            //update names
            $scope.data.NamesAndAliases.Names = toArray($scope.data.NamesAndAliases.Names);
            //update aliases
            $scope.data.NamesAndAliases.Aliases = toArray($scope.data.NamesAndAliases.Aliases);
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
            templateUrl: "/templates/person/Common.html"
        };
    }

})()