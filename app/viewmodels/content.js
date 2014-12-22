define(['knockout', 'userContext', 'plugins/router', 'auctionContext'], function (ko, userContext, router, auctionContext) {

    function ViewModel() {
        this.auctions = ko.observableArray([]);
        this.error = ko.observable('');
        this.loading = ko.observable(false);
        this.currentPage = 1;
        this.lastPage = false;
    }

    ViewModel.prototype.canActivate = function () {
        return userContext.isLoggedIn() ? true : {redirect: 'login'};
    };

    ViewModel.prototype.activate = function () {
        var progress = auctionContext.load(), me = this;
        this.currentPage = 1;
        this.lastPage = false;
        progress.done(function (auctions) {
            if (auctions.length < 15) me.lastPage = true;
            me.auctions(auctions);
        });
        progress.fail(function (e) {
            me.error(e);
            document.querySelector('#errorToast').show();
        });
        progress.finally(function () {
            me.loading(false);
            document.querySelector('#spinner').dismiss();
        });
    };

    ViewModel.prototype.attached = function () {
        var me = this;
        me.loading(true);
        document.querySelector('#spinner').show();
        document.querySelector('core-scaffold').addEventListener('scroll', function(e) {
            if (me.loading() || me.lastPage) return;
            var scroller = e.detail.target;
            if (scroller.scrollTop + scroller.clientHeight > scroller.scrollHeight - 50) {
                me.loadNextPage();
            }
        });
    };

    ViewModel.prototype.loadNextPage = function() {
        var me = this;
        this.loading(true);
        this.currentPage += 15;
        var progress = auctionContext.load(null, 15, this.currentPage);
        progress.done(function (auctions) {
            if (auctions.length < 15) me.lastPage = true;
            me.auctions(me.auctions().concat(auctions));
        });
        progress.fail(function (e) {
            me.error(e);
            document.querySelector('#errorToast').show();
        });
        progress.finally(function () {
            me.loading(false);
        });
    };

    return new ViewModel();
});
