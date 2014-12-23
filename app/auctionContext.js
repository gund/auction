define(['Q', 'plugins/http', 'durandal/app', 'userContext'], function (Q, http, app, userContext) {

    function AuctionContext() {
    }

    /**
     * Factory for Auction
     * @param {String} title
     * @param {String} description
     * @param {String} image
     * @param {Number} startBet
     * @param {String|Date} endDate
     * @param {String} userId
     * @param {Number=} currentBet
     * @param {String=} buyerId
     * @returns {Auction}
     */
    AuctionContext.prototype.newAuction = function (title, description, image, startBet, endDate, userId, currentBet, buyerId) {
        startBet = parseFloat(startBet);
        return new Auction(title, description, image, startBet, endDate, userId, currentBet, buyerId);
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

    AuctionContext.prototype.loadById = function (id) {
        id = id || '';
        var dfd = Q.defer();
        var url = "https://api.parse.com/1/classes/Auction/" + id;
        var data = {
            include: "user,buyer"
        };

        http.get(url, data, app.parseHeaders)
            .done(function (response) {
                response.buyer = response.buyer || null;
                dfd.resolve(response);
            })
            .fail(function (e) {
                dfd.reject(JSON.parse(e.responseText).error);
            });

        return dfd.promise;
    };

    AuctionContext.prototype.load = function (userId, limit, offset) {
        userId = userId || null;
        limit = limit || 15;
        offset = offset || 0;

        var dfd = Q.defer();
        var url = "https://api.parse.com/1/classes/Auction";
        var data = {
            limit: limit,
            skip: offset,
            include: "user",
            order: "-createdAt"
        };
        if (userId) data['where'] = {
            user: {
                __type: "Pointer",
                className: "_User",
                objectId: userId
            }
        };

        http.get(url, data, app.parseHeaders)
            .done(function (response) {
                dfd.resolve(response.results);
            })
            .fail(function (e) {
                dfd.reject(JSON.parse(e.responseText).error);
            });

        return dfd.promise;
    };

    AuctionContext.prototype.addBet = function (newBet, auctionId) {
        newBet = parseFloat(newBet) || 0;
        auctionId = auctionId || null;
        if (!auctionId) return;

        var dfd = Q.defer();
        var url = "https://api.parse.com/1/classes/Auction/" + auctionId;
        var data = {
            currentBet: newBet,
            buyer: {
                __type: "Pointer",
                className: "_User",
                objectId: userContext.getUserId()
            }
        };

        http.put(url, data, app.parseHeaders)
            .done(function (response) {
                dfd.resolve(response);
            })
            .fail(function (e) {
                dfd.reject(JSON.parse(e.responseText).error);
            });

        return dfd.promise;
    };

    AuctionContext.prototype.findByTitle = function (title, userId) {
        title = title || '';
        userId = userId || null;
        if (title == '') return;

        var dfd = Q.defer();
        var url = "https://api.parse.com/1/classes/Auction";
        var data = {
            limit: 15,
            where: {
                title: {
                    "$regex": title,
                    "$options": "i"
                }
            }
        };
        if (userId) data.where.user = {
            __type: "Pointer",
            className: "_User",
            objectId: userId
        };

        http.get(url, data, app.parseHeaders)
            .done(function (response) {
                dfd.resolve(response.results);
            })
            .fail(function (e) {
                dfd.reject(JSON.parse(e.responseText).error);
            });

        return dfd.promise;
    };

    /**
     * Auction Class
     * @param {String} title
     * @param {String} description
     * @param {String} image
     * @param {Number} startBet
     * @param {String|Date} endDate
     * @param {String} userId
     * @param {Number=} currentBet
     * @param {String=} buyerId
     * @constructor
     */
    function Auction(title, description, image, startBet, endDate, userId, currentBet, buyerId) {
        this.title = title || '';
        this.description = description || '';
        this.image = image || '';
        this.startBet = startBet || 0;
        this.endDate = endDate || '';
        this.userId = userId || null;
        this.currentBet = currentBet || 0;
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
