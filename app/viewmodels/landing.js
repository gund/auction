define(['knockout', 'userContext'], function (ko, userContext) {

    var viewModel = {
        canActivate: canActivate
    };

    function canActivate() {
        if (userContext.isLoggedIn()) {
            return {redirect: 'all'};
        }
        return true;
    }

    return viewModel;
});