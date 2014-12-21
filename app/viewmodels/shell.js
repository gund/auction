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
            return router.activate();
        }
    };

    function computeMenu() {
        var showUserMenu = router.updateMenu();
        var menu = [
            {route: '', moduleId: 'viewmodels/landing', nav: false},
            {route: 'home', title: 'Home', moduleId: 'viewmodels/landing', nav: !showUserMenu, icon: 'home'},
            {route: 'login', title: 'Login', moduleId: 'viewmodels/login', nav: !showUserMenu, icon: 'account-circle'},
            {
                route: 'registration',
                title: 'Registration',
                moduleId: 'viewmodels/registration',
                nav: !showUserMenu,
                icon: 'add-circle'
            },
            {route: 'all', title: 'All auctions', moduleId: 'viewmodels/content', nav: showUserMenu, icon: "list"},
            {
                route: 'myauctions',
                title: 'My auctions',
                moduleId: 'viewmodels/myauctions',
                nav: showUserMenu,
                icon: "grade"
            },
            {route: 'logout', title: 'Logout', moduleId: 'viewmodels/logout', nav: showUserMenu, icon: "exit-to-app"},
            {route: 'settings', title: 'Settings', moduleId: 'viewmodels/settings', nav: false, icon: "settings"}
        ];
        router.reset();
        router.map(menu).buildNavigationModel();
        return menu;
    }


    router.updateMenu = ko.observable(userContext.isLoggedIn());
    router.appMenu = ko.computed(computeMenu);
    router.selectedTab = ko.observable(0);
    router.showFullMenu = ko.observable(false);
    router.guardRoute = function (routeInfo, params) {
        routes.title(params.config.title);
        router.showFullMenu(userContext.isLoggedIn());
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