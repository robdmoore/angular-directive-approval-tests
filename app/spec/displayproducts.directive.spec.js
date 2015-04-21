"use strict";

describe("myapp-display-products", function () {

    beforeEach(module("myApp"));
    beforeEach(DirectiveFixture.init);

    it("should output product information", function () {
        HttpMocks.product.basicCars(DirectiveFixture);

        DirectiveFixture.verify(heredoc(function () {/*    
            <myapp-display-products category="car" product="car">
                <div>{{car.name}}</div>
            </myapp-display-products>
        */}));
    });
});