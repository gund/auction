define(['knockout', 'userContext', 'plugins/router', 'auctionContext'], function (ko, userContext, router, auctionContext) {

    var vm = null;

    function ViewModel() {
        vm = this;
        this.auctions = ko.observableArray([]);
        this.auctionsCache = [];
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
            me.auctionsCache = auctions;
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
        document.querySelector('core-scaffold').addEventListener('scroll', function (e) {
            if (me.loading() || me.lastPage) return;
            var scroller = e.detail.target;
            if (scroller.scrollTop + scroller.clientHeight > scroller.scrollHeight - 50) {
                me.loadNextPage();
            }
        });
    };

    ViewModel.prototype.loadNextPage = function () {
        var me = this;
        this.loading(true);
        this.currentPage += 15;
        var progress = auctionContext.load(null, 15, this.currentPage);
        progress.done(function (auctions) {
            if (auctions.length < 15) me.lastPage = true;
            me.auctions(me.auctions().concat(auctions));
            me.auctionsCache = me.auctions();
        });
        progress.fail(function (e) {
            me.error(e);
            document.querySelector('#errorToast').show();
        });
        progress.finally(function () {
            me.loading(false);
        });
    };

    ViewModel.prototype.search = ko.computed(function () {
        var text = router.searchText();
        if (!vm) return;
        var me = vm;
        if (text == '') {
            me.auctions(me.auctionsCache);
            return;
        }
        me.loading(true);
        me.auctions([]);
        var progress = auctionContext.findByTitle(text);
        progress.done(function (auctions) {
            if (router.searchText() != '') me.auctions(auctions);
        });
        progress.fail(function (e) {
            me.error(e);
            document.querySelector('#errorToast').show();
        });
        progress.finally(function () {
            me.loading(false);
        });
    });

    return new ViewModel();
});
