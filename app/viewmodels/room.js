define(['userContext', 'plugins/router', 'auctionContext', 'knockout.validation', 'knockout'], function (userContext, router, auctionContext, validation, ko) {

    ko.validation.configure({
        registerExtenders: false,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: false,
        messageTemplate: null
    });

    function ViewModel() {
        this.error = ko.observable('');
        this.formLoading = ko.observable(false);
        this.auction = ko.observableArray([]);
        this.isOwner = ko.observable(false);
        this.betAmount = ko.observable(0).extend({
            required: {
                params: true,
                message: "Bet Amount is required."
            },
            digit: true
        });
        this.auctionId = null;

        this.errors = ko.validation.group(this);
    }

    ViewModel.prototype.canActivate = function () {
        return userContext.isLoggedIn() ? true : {redirect: 'login'};
    };

    ViewModel.prototype.activate = function (id) {
        if (!id) {
            router.navigate('');
            return;
        }
        this.auctionId = id;
        this.loadAuction();
    };

    ViewModel.prototype.loadAuction = function () {
        var me = this;
        this.formLoading(true);
        var progress = auctionContext.loadById(this.auctionId);
        progress.done(function (auction) {
            me.auction.push(auction);
            if (me.auction()[0].user.objectId === userContext.getUserId()) me.isOwner(true);
        });
        progress.fail(function (e) {
            me.error(e);
            document.querySelector('#errorToast').show();
        });
        progress.finally(function () {
            me.formLoading(false);
        });
    };

    ViewModel.prototype.setBet = function () {
        var me = this;
        if (this.betAmount() <= (this.auction()[0]).currentBet) {
            this.error('Cannot set bet less then current bet');
            document.querySelector('#errorToast').show();
            return;
        }
        this.formLoading(true);
        var progress = auctionContext.addBet(this.betAmount(), this.auctionId);
        progress.done(function () {
            var temp = me.auction()[0];
            me.auction([]);
            temp.currentBet = me.betAmount();
            me.auction.push(temp);
            document.querySelector('#betToast').show();
        });
        progress.fail(function (e) {
            me.error(e);
            document.querySelector('#errorToast').show();
        });
        progress.finally(function () {
            me.formLoading(false);
        });
    };

    return ViewModel;
});
