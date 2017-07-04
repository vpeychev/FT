(function () {
	'use strict';

	angular.module("app").directive("comments", [directive]);
 	function directive() {
	    return {
	        restrict: "E",
		    scope: {
		        comments: "=",
                col12: "@"
		    }
            , templateUrl: "/templates/comments.html"
		};
	}

})();