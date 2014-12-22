define(['knockout', 'userContext', 'plugins/router', 'auctionContext'], function (ko, userContext, router, auctionContext) {

    function ViewModel() {
        this.auctions = ko.observableArray([]);
        this.error = ko.observable('');
    }

    ViewModel.prototype.canActivate = function() {
        return userContext.isLoggedIn() ? true : {redirect: 'login'};
    };

    ViewModel.prototype.activate = function() {
        var progress = auctionContext.load(userContext.getUserId()), me = this;
        progress.done(function (auctions) {
            me.auctions(auctions);
        });
        progress.fail(function(e) {
            this.error(e);
            document.querySelector('#errorToast').show();
        });
        progress.finally(function() {
            document.querySelector('#spinner').dismiss();
        });
    };

    ViewModel.prototype.attached = function() {
        document.querySelector('#spinner').show();
    };

    ViewModel.prototype.toRoom = function (roomId) {
        router.navigate('room/' + roomId);
    };

    return new ViewModel();

});
