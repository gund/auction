define(['knockout', 'userContext', 'plugins/router'], function (ko, userContext, router) {

    var viewModel = {
        canActivate: canActivate
    };

    function canActivate() {
        if (userContext.isLoggedIn()) {
            return true;
        }
        return {redirect: 'login'};
    }

    return viewModel;

});
