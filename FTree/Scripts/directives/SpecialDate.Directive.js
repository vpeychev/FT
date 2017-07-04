(function () {
    angular.module("app").directive("specialDates", specialDatesDirective);
    function specialDatesDirective() {
        return {
            restruct: "E",
            scope: {
                name: "@",
                mode: "@",
                obj: "="
            },
            template: [
                '<div class="col-xs-12 col-lg-6 padding-left-0" ng-if="obj.Date!==\'NA\'">',
                    '<h5 style="margin-top:5px; border-bottom:1px solid #cdcdcd; border-top:none;">{{name}}</h5>',
                    '<label-value-input label="Date" value="obj.Date" col-size="7" mode="{{mode}}"></label-value-input>',
                    '<label-value-input label="Place" value="obj.Location" col-size="7" mode="{{mode}}"></label-value-input>',
                '</div>'
            ].join("")
        };
    }
})()