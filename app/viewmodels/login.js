define(['knockout', 'userContext', 'plugins/router', 'knockout.validation'], function (ko, userContext, router, validation) {

    ko.validation.configure({
        registerExtenders: false,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: false,
        messageTemplate: true
    });

    function ViewModel() {
        this.login = ko.observable().extend({
            required: {
                params: true,
                message: "Login is required."
            },
            minLength: 3
        });
        this.password = ko.observable().extend({
            required: {
                params: true,
                message: "Password is required."
            },
            minLength: 6
        });
        this.error = ko.observable();
        this.errors = ko.validation.group(this);
    }

    ViewModel.prototype.canActivate = function () {
        if (userContext.isLoggedIn()) {
            return { redirect: 'all' };
        }
        return true;
    };

    ViewModel.prototype.submit = function () {
        var me = this;
        if (this.errors().length == 0) {
            document.querySelector('#spinner').show();
            userContext.signin(this.login(), this.password())
                .then(function () {
                    if (userContext.isLoggedIn()) {
                        router.navigate('all');
                        router.updateMenu(userContext.isLoggedIn());
                    }
                })
                .catch(function (e) {
                    var serverErrorMessage = JSON.parse(e.responseText).error;
                    console.log(serverErrorMessage);
                    me.error(serverErrorMessage);
                    document.querySelector('#errorToast').show();
                })
                .finally(function(){
                    document.querySelector('#spinner').hide();
                });
        } else {
            this.errors.showAllMessages();
        }
    };

    return new ViewModel();
});