var getCurrentSpec = (function () {
    var currentSpec = null;
    window.jasmine.getEnv().addReporter({
        specStarted: function (spec) { currentSpec = spec; },
        specDone: function () { currentSpec = null; }
    });
    return function () { return currentSpec; };
})();

function verify(data) {
    data = data.replace(/\r?\n/g, "\r\n");
    var xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:1338/verify', false);
    xhr.send(JSON.stringify({ testName: getCurrentSpec().fullName.replace(/\W/g, "-"), data: data }));
    if (xhr.status !== 200) {
        throw xhr.responseText;
    }
}