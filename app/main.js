requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-3.1.0',
        'jquery': '../lib/jquery/jquery-1.9.1',
        'Q': '../lib/q/q',

        'userContext': 'userContext',
        'auctionContext': 'auctionContext',
        'knockout.validation':'../lib/knockout-validation/knockout.validation'
    },
    shim: {
        "knockout.validation": ["knockout"]
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', "userContext"], function (system, app, viewLocator) {
    app.title = 'Auction 1.0';

    app.parseHeaders = {
        "X-Parse-Application-Id": "5aANDFPFiBGti8xHjR52GsO6DP6GpT6LzIr7q9X6",
        "X-Parse-REST-API-Key": "RclC9e0afgL4oQhfauYPQZhU5NOJUVQHyr66JK6v"
    };

    app.configurePlugins({
        router: true,
        dialog: true
    });

    app.start().then(function () {
        viewLocator.useConvention();
        app.setRoot('viewmodels/shell', 'entrance');
    });
});