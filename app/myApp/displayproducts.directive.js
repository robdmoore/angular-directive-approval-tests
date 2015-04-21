(function (angular) {
    "use strict";

    angular
        .module("myApp")
        .directive("myappDisplayProducts", displayProducts);

    displayProducts.$inject = ["productService"];
    function displayProducts(productService) {

        var directive = {
            compile: compile,
            restrict: "AE",
            scope: true
        };
        return directive;

        function link(scope, element, attrs) {
            scope.products = [];
            productService.getByCategory(attrs.category).then(function (result) {
                scope.products = result;
            });
        }

        function compile(element, attrs, transclude) {
            var template = angular.element("<div ng-repeat=\"" + attrs.product + " in products\"></div>");
            template.append(element.children());
            element.html("").append(template);
            return {
                post: link
            };
        }

    };
})(angular);
