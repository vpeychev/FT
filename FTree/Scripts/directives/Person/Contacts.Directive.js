﻿(function () {

    angular.module("app").directive("personContacts", personContactsDirective);
    function personContactsDirective() {
        var controller = function ($scope, $element) {
            //update addresses
            //$scope.data.NamesAndAliases.Aliases = toArray($scope.data.NamesAndAliases.Aliases);
            //update contacts
            //$scope.data.NamesAndAliases.Names = toArray($scope.data.NamesAndAliases.Names);
            //update comments
            //$scope.data.NamesAndAliases.Names = toArray($scope.data.NamesAndAliases.Names);
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
            templateUrl: "/templates/person/Contacts.html"
        };
    }

})()