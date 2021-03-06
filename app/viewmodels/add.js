define(['knockout', 'userContext', 'knockout.validation', 'auctionContext', 'Q', 'plugins/router'], function (ko, userContext, validation, auctionContext, Q, router) {

    ko.validation.configure({
        registerExtenders: false,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: false,
        messageTemplate: null
    });

    function ViewModel() {
        this.formLoading = ko.observable(false);
        this.error = ko.observable('');
        this.imageSrc = ko.observable('');

        this.title = ko.observable('').extend({
            required: {
                params: true,
                message: "Title is required."
            }
        });
        this.description = ko.observable('').extend({
            required: {
                params: true,
                message: "Description is required."
            }
        });
        this.image = ko.observable('').extend({
            required: {
                params: true,
                message: "Image is required."
            }
        });
        this.startBet = ko.observable(0).extend({
            required: {
                params: true,
                message: "Start Bet is required."
            },
            digit: true
        });
        this.endDate = ko.observable((new Date()).toJSON().slice(0,10)).extend({
            required: {
                params: true,
                message: "End Date is required."
            },
            date: true
        });

        this.errors = ko.validation.group(this);
    }

    ViewModel.prototype.canActivate = function () {
        return userContext.isLoggedIn() ? true : {redirect: 'login'};
    };

    ViewModel.prototype.updateImage = function (vm, e) {
        var fileInfo = e.currentTarget.files[0] || null, me = this;
        if (fileInfo === null) {
            this.imageSrc('');
            return;
        }
        getImageData(fileInfo).done(function (srcData) {
            me.imageSrc(srcData);
        });
    };


    ViewModel.prototype.addAuction = function () {
        var me = this;
        if (this.errors().length == 0) {
            var endDate = (new Date(this.endDate())).getTime();
            if(endDate < Date.now()){
                this.error("Not actual date");
                document.querySelector('#errorToast').show();
                return;
            }
            this.formLoading(true);
            document.querySelector('#spinner').show();
            var auction = auctionContext.newAuction(
                this.title(),
                this.description(),
                this.imageSrc(),
                this.startBet(),
                new Date(this.endDate()),
                userContext.getUserId()
            );
            var progress = auctionContext.add(auction);
            progress.finally(function () {
                me.formLoading(true);
                document.querySelector('#spinner').dismiss();
            });
            progress.done(function (data) {
                router.navigate('room/' + data.objectId);
            });
            progress.fail(function (error) {
                me.error(error);
                document.querySelector('#errorToast').show();
            });
        } else this.errors.showAllMessages();
    };

    function getImageData(imageInfo) {
        var reader = new FileReader(), dfd = Q.defer();
        console.log('loading...');
        reader.onload = function (e) {
            console.log('loaded');
            var image = new Image();
            image.onload = (function() {
                var newSize = scale(250, 250, image.width, image.height);
                console.log(image.width, image.height);
                console.log(newSize.w, newSize.h);
                var canvas = document.createElement('canvas');
                image.width = newSize.w;
                image.height = newSize.h;
                canvas.width = 250;
                canvas.height = 250;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, newSize.w, newSize.h);
                var imgSrc = canvas.toDataURL('image/jpeg', 0.7);
                dfd.resolve(imgSrc);
            });
            image.src = e.target.result;
        };
        reader.readAsDataURL(imageInfo);
        return dfd.promise;
    }

    function scale(maxW, maxH, currW, currH) {
        var ratio = currH / currW;
        if (currW >= maxW && ratio <= 1) {
            currW = Math.round(maxH / ratio);//maxW;
            currH = maxH;//Math.round(currW * ratio);
        } else if (currH >= maxH) {
            currH = Math.round(maxW * ratio);//maxH;
            currW = maxW;//Math.round(currH / ratio);
        }
        return {
            w: currW,
            h: currH
        };
    }

    return ViewModel;
});
