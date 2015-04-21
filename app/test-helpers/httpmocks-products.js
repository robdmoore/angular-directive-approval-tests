var HttpMocks = HttpMocks || {};

HttpMocks.product = {
    empty: function (fixture) {
        fixture.$httpBackend.when("GET", fixture.config.productsApiUrl)
            .respond(200, []);
    },
    basicCars: function (fixture) {
        fixture.$httpBackend.when("GET", fixture.config.productsApiUrl)
            .respond(200, [
                {name: "car 1", category: "car"},
                {name: "car 2", category: "car"}
            ]);
    }
};