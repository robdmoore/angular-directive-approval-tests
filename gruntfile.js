/// <vs SolutionOpened='dev' />
module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').filter(function (task) { return task != 'grunt-cli'; }).forEach(grunt.loadNpmTasks);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        libs: {
            myApp: [
                'app/lib/jquery/dist/jquery.js',
                'app/lib/angular/angular.js',
                'app/lib/bootstrap/dist/js/bootstrap.js'
            ]
        },
        src: {
            myApp: [
                'app/myApp/*.js',
                'app/myApp/!(*.spec).js'
            ]
        },
        spec: {
            myApp: [
                'app/myApp/*.spec.js'
            ],
            testhelpers: [
                'node_modules/js-beautify/js/lib/beautify-html.js',
                'app/lib/angular-mocks/angular-mocks.js',
                'app/test-helpers/*.js'
            ]
        },
        dest: {
            myApp: 'app/dist/myApp.js'
        },
        uglify: {
            options: {
                mangle: false,
                sourceMap: true
            },
            myApp: {
                src: [
                    '<%= libs.myApp %>',
                    '<%= src.myApp %>'
                ],
                dest: '<%= dest.myApp %>'
            }
        },
        watch: {
            myApp: {
                files: ['<%= src.myApp %>', '<%= spec.myApp %>', 'app/test-helpers/*.js'],
                tasks: ['karma:watch:run', 'uglify']
            }
        },
        karma: {
            options: {
                autoWatch: false,
                frameworks: ['jasmine'],
                colors: true,
                logLevel: 'INFO',
                browsers: ['PhantomJS'],
                browserNoActivityTimeout : 60000,
                files: ['<%= libs.myApp %>', '<%= src.myApp %>', '<%= spec.testhelpers %>', '<%= spec.myApp %>']
            },
            myApp: {
                singleRun: true,
                reporters: ['progress', 'junit']
            },
            watch: {
                singleRun: false,
                background: true
            },
            debug: {
                logLevel: 'DEBUG',
                singleRun: false,
                browsers: ['Chrome']
            }
        },
        junitReporter: {
            outputFile: 'test-results.xml',
            suite: ''
        },
        browserSync: {
            bsFiles: {
                src : 'dist/*.js'
            },
            options: {
                server: {
                    baseDir: "./app/"
                }
            }
        }
    });

    grunt.registerTask('start-approvals-server', 'Start approvals server', function () {
        var done = this.async();
        isPortTaken(1338, function(e, isTaken) {
            if (!isTaken) {
                global.server = require('approvals-server')({
                    approvals: {
                        appendEOL: true,
                        EOL:  '\r\n'
                    },
                    port: 1338,
                    path: './App/test-helpers/approvals'
                });
            } else {
                console.warn('WARNING: Approval server already running?');
            }
            done();
        });
    });
    grunt.registerTask('stop-approvals-server', 'Start approvals server', function () {
        if (global.server) {
            global.server.close();
        }
    });
    grunt.registerTask('run', ['uglify', 'browserSync']);
    grunt.registerTask('default', ['tests', 'uglify']);
    grunt.registerTask('tests', ['start-approvals-server', 'karma:myApp', 'stop-approvals-server']);
    grunt.registerTask('dev', ['start-approvals-server', 'karma:watch:start', 'watch', 'stop-approvals-server']);
    // Put `debugger;` in the test(s) you want to debug and run this task to debug in Chrome, click Debug, press F12 and refresh
    grunt.registerTask('debugtests', ['start-approvals-server', 'karma:debug:start', 'stop-approvals-server' ]);

    // https://gist.github.com/timoxley/1689041
    function isPortTaken(port, fn) {
        var net = require('net');
        var tester = net.createServer()
            .once('error', function(err) {
                if (err.code != 'EADDRINUSE') {
                    return fn(err);
                }
                fn(null, true);
            })
            .once('listening', function() {
                tester
                    .once('close', function () { fn(null, false); })
                    .close();
            })
            .listen(port);
    }
};
