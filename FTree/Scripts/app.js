;(function () {
    'use strict';
    angular.module("app", ["ngAnimate", "ngResource", "ui.bootstrap"]);
})()

function toArray(obj) {
    if (obj !== undefined) {
        if (!Array.isArray(obj)) {
            var tmp = obj;
            obj = [];
            obj.push(tmp);
        }
    }
    return obj;
}