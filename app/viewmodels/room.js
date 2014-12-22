define(['userContext', 'plugins/router'], function(userContext, router) {
    function ViewModel() {
        this.auctionId = null;
    }

    ViewModel.prototype.canActivate = function() {
        return userContext.isLoggedIn() ? true : {redirect: 'login'};
    };

    ViewModel.prototype.activate = function(id) {
        if (!id) {
            router.navigate('');
            return;
        }
        this.auctionId = id;
        //TODO Load auction from Parse
    };

    return new ViewModel();
});