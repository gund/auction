define(['Q', 'plugins/http', 'durandal/app'], function (Q, http, app) {
    function AuctionContext() {

    }

    AuctionContext.prototype.newAuction = function (title, description, image, startBet, endDate, currentBet, userId, buyerId) {
        return new Auction(title, description, image, startBet, endDate, currentBet, userId, buyerId);
    };

    AuctionContext.prototype.add = function (auction) {
        var dfd = Q.defer();
        var url = "https://api.parse.com/1/classes/Auction";

        http.post(url, auction.toDataUrl(), app.parseHeaders)
            .done(function (response) {
                dfd.resolve(response);
            })
            .fail(function (e) {
                dfd.reject(JSON.parse(e.responseText).error);
            });

        return dfd.promise;
    };

    function Auction(title, description, image, startBet, endDate, currentBet, userId, buyerId) {
        this.title = title || '';
        this.description = description || '';
        this.image = image || '';
        this.startBet = startBet || 0;
        this.currentBet = currentBet || 0;
        this.endDate = endDate || '';
        this.userId = userId || null;
        this.buyerId = buyerId || null;
        if (this.endDate instanceof String) this.endDate = new Date(this.endDate);
    }

    Auction.prototype.toDataUrl = function () {
        var data = {};
        data.title = this.title;
        data.description = this.description;
        data.imageSrc = this.image;
        data.startBet = this.startBet;
        data.currentBet = this.currentBet;
        if (this.endDate) data.endDate = {
            "__type": "Date",
            "iso": this.endDate.toISOString()
        };
        if (this.userId) data.user = {
            "__type": "Pointer",
            "className": "_User",
            "objectId": this.userId
        };
        if (this.buyerId) data.buyer = {
            "__type": "Pointer",
            "className": "_User",
            "objectId": this.buyerId
        };
        return data;
    };

    return new AuctionContext();
});
