define(['userContext', 'plugins/router'], function(userContext, router) {
    var viewModel = {
        canActivate: function() {
            userContext.logout();
            router.updateMenu(userContext.isLoggedIn());
            return {redirect: 'login'};
        }
    };

    return viewModel;
});