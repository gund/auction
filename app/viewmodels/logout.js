define(['userContext', 'plugins/router'], function (userContext, router) {
    var viewModel = {
        canActivate: function () {
            if (userContext.isLoggedIn()) {
                document.querySelector('#logout').toggle();
                return true;
            }
            return {redirect: 'login'};
        }
    };


    return viewModel;
});