(function () {
    angular.module("app").directive("labelValueInput", labelValueDirective);
    function labelValueDirective() {
        return {
            restrict: "E",
            scope: {
                label: "@",
                colSize: "@",
                mode: "@",
                isDisabled: '@',
                value: "="
            },
            template: [
                '<div class="row">',
                    '<label for="label-{{label}}" class="col-xs-3">{{label}}</label>',
                    '<input type="text" id="label-{{label}}" ng-show="{{mode===\'Edit\'}}" ng-model="value" ng-disabled="{{isDisabled}}" class="col-xs-{{colSize}} padding-0" />',
                    '<span id="label-{{label}}" ng-show="{{mode!==\'Edit\'}}" class="col-xs-{{colSize}}">{{value}}</span>',
                '</div>'].join("")
        };
    }
})()