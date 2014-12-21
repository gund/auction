define(['plugins/router', 'durandal/app', 'userContext', 'knockout'], function (router, app, userContext, ko) {

    var routes = {
        title: ko.observable(''),
        appTitle: app.title,
        router: router,
        search: function () {
            app.showMessage('Search not yet implemented...');
        },
        navigate: function () {

        },
        activate: function () {

            var menu = [];
            if (userContext.isLoggedIn()) {
                menu.push(
                    {route: '', title: 'All auctions', moduleId: 'viewmodels/content', nav: true, icon: "list"},
                    {
                        route: 'myauctions',
                        title: 'My auctions',
                        moduleId: 'viewmodels/myauctions',
                        nav: true,
                        icon: "grade"
                    }
                );
            } else {
                menu.push(
                    {route: '', moduleId: 'viewmodels/landing', nav: false},
                    {route: 'home', title: 'Home', moduleId: 'viewmodels/landing', nav: true, icon: 'home'},
                    {route: 'login', title: 'Login', moduleId: 'viewmodels/login', nav: true, icon: 'account-circle'},
                    {
                        route: 'registration',
                        title: 'Registration',
                        moduleId: 'viewmodels/registration',
                        nav: true,
                        icon: 'add-circle'
                    }
                );
            }
            router.map(menu).buildNavigationModel();
            return router.activate();
        }
    };

    router.selectedTab = ko.observable(0);
    router.showFullMenu = ko.observable(false);
    router.guardRoute = function (routeInfo, params) {
        routes.title(params.config.title);
        if (userContext.isLoggedIn()) {
            router.showFullMenu(true);
        }
        var routeMaps = router.navigationModel();
        for (var i = 0; i < routeMaps.length; ++i) {
            if (routeMaps[i].route == params.fragment) {
                break;
            }
        }
        if (routeMaps.length == i) {
            i = 0;
        }
        router.selectedTab(i);
        return true;
    };

    return routes;
});