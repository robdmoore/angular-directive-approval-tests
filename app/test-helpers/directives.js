var DirectiveFixture = {};
DirectiveFixture.init = inject(function($compile, $rootScope, $httpBackend, config) {
    DirectiveFixture.$compile = $compile;
    DirectiveFixture.$rootScope = $rootScope;
    DirectiveFixture.$httpBackend = $httpBackend;
    DirectiveFixture.config = config;
});
DirectiveFixture.verify = function (markupToCompileAndVerify) {
    var scope = DirectiveFixture.$rootScope.$new();
    var output = DirectiveFixture.$compile(markupToCompileAndVerify)(scope);

    DirectiveFixture.$httpBackend.flush();
    scope.$apply();
    var cleanHtml = cleanAngularMarkup(output);
    var beautifiedOutput = window.html_beautify(cleanHtml);
    verify(beautifiedOutput);

    DirectiveFixture.$httpBackend.verifyNoOutstandingExpectation();
    DirectiveFixture.$httpBackend.verifyNoOutstandingRequest();

    function cleanAngularMarkup(dom) {

        // Ensure the whole dom is wrapped in a div so we get the whole snippet when calling .html()
        dom = $("<div />").append(dom.clone());

        // Remove Angular directives and classes
        dom.find("*").each(function () {
            if (this.attributes) {
                var $this = $(this);
                $.each(this.attributes, function (i, attrib) {
                    if (attrib && attrib.name.match(/^ng-/)) {
                        $this.removeAttr(attrib.name);
                    }
                });
            }
        });
        dom.find(".ng-scope").removeClass("ng-scope");
        dom.find(".ng-binding").removeClass("ng-binding");

        // Remove empty class attributes
        dom.find("*[class='']")
            .removeAttr("class");

        // Remove comments
        dom.find("*")
            .contents()
            .each(function () {
                if (this.nodeType == 8) {
                    $(this).remove();
                }
            });

        // Replace empty spans with their text content
        dom.find("span")
            .filter(function() {
                return this.attributes.length == 0
                    && $(this).children().size() == 0;
            })
            .replaceWith(function() {
                return $(this).contents();
            });

        return dom.html();
    }
};
