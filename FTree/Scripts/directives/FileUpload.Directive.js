(function () {
    'use strict';

    angular.module("app").directive("uploadFile", ["$timeout", function ($timeout) {
        return {
            restrict: "A",
            scope: { uploadFile: "@" },
            link: function (scope, element, attrs) {
                var elementId = scope.uploadFile || "upload";
                element.bind("click", function (e) {
                    $timeout(
                        function () {
                            var element = angular.element(document.getElementById(elementId));
                            //select a file for upload
                            element[0].click();
                        },
                        100);
                });
            }
        };
    }]);

    //register a function to call when selecting file is done
    angular.module("app").directive("fileChange", [function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var onChangeHandle = scope.$eval(attrs.fileChange);
                element.bind("change", onChangeHandle);
            }
        };
    }]);

})();