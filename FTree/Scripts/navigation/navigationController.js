(function () {
    'use strict';

    angular.module("app").controller("NavigationController", ["$scope", "$http", "HomeService", navigationController]);

    function navigationController($scope, $http, HomeService) {

        $scope.uploadFile = function (event) {
            //save file info to scope
            $scope.currentImportingFilesObj = event.target.files;
            $scope.currentImportingFileName = $scope.currentImportingFilesObj[0].name;
            $scope.$apply();
        }

        $scope.importExcelFile = function () {
            _importFromExcel(
                $scope.currentImportingFilesObj,
                function (result) {

                    //TODO: update familly treeview (reload HomeService._data)
                    HomeService.updateFamilyHierarchy();
                });
        }

        var _importFromExcel = function (files, callback) {
            var fd = new FormData();
            fd.append('file', files[0]);
            var element = angular.element(document.getElementById('uploadImport'));

            $http.post("/Home/UploadEromExcel/" + 0, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            })
            .success(function (result) {
                callback(result);
            })
            .error(function (result) {
            });
        }

    };

})();