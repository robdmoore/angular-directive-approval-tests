(function (angular) {
    "use strict";

    angular
        .module("myApp")
        .factory("productService", productService);

    productService.$inject = ["$http", "config"];
    function productService($http, config) {

        var productsPromise = $http.get(config.productsApiUrl);

        return {
            getByCategory: getByCategory
        }

        function getByCategory(searchCategory) {
            return productsPromise.then(function (products) {
                return products.data.filter(function (p) {
                    return p.category === searchCategory;
                });
            }, function (e) {
                throw e;
            });
        }
    };
})(angular);
