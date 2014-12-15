define(['plugins/router', 'durandal/app', 'userContext', 'knockout'], function (router, app, userContext, ko) {

    var routes = {
        router: router,
        search: function () {
            app.showMessage('Search not yet implemented...');
        },
        navigate: function () {

        },
        activate: function (menu) {

            var menu = [];
            if (userContext.isLoggedIn()) {
                menu.push(
                    {route: '', title: 'All auctions', moduleId: 'viewmodels/content', nav: true},
                    {route: 'myauctions', title: 'My auctions', moduleId: 'viewmodels/myauctions', nav: true}
                );
            } else {
                menu.push(
                    {route: '', moduleId: 'viewmodels/landing', nav: false},
                    {route: 'home', title: 'Home', moduleId: 'viewmodels/landing', nav: true},
                    {route: 'login', title: 'Login', moduleId: 'viewmodels/login', nav: true},
                    {route: 'registration', title: 'Registration', moduleId: 'viewmodels/registration', nav: true}
                );
            }
            router.map(menu).buildNavigationModel();
            return router.activate();
        }
    };

    function getShellMenu() {
        var menu = [];
        if (userContext.isLoggedIn()) {
            menu.push(
                {route: '', title: 'All auctions', moduleId: 'viewmodels/content', nav: true},
                {route: 'myauctions', title: 'My auctions', moduleId: 'viewmodels/myauctions', nav: true}
            );
        } else {
            menu.push(
                {route: '', moduleId: 'viewmodels/landing', nav: false},
                {route: 'home', title: 'Home', moduleId: 'viewmodels/landing', nav: true},
                {route: 'login', title: 'Login', moduleId: 'viewmodels/login', nav: true},
                {route: 'registration', title: 'Registration', moduleId: 'viewmodels/registration', nav: true}
            );
        }
        return menu;
    }

    router.selectedTab = ko.observable(0);
    router.showFullMenu = ko.observable(false);
    router.guardRoute = function (routeInfo, params) {
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