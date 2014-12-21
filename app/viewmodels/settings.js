define(['knockout', 'userContext', 'knockout.validation', 'plugins/http', 'durandal/app'], function (ko, userContext, validation, http, app) {

    ko.validation.configure({
        registerExtenders: false,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: false,
        messageTemplate: null
    });

    function ViewModel() {
        this.email = ko.observable().extend({
            required: {
                params: true,
                message: "Email is required."
            },
            email: true
        });
        this.login = ko.observable().extend({
            required: {
                params: true,
                message: "Login is required."
            },
            minLength: 3
        });
        this.password = ko.observable().extend({
            minLength: 6
        });
        this.newPassword = ko.observable().extend({
            minLength: 6,
            equal: {
                params: this.password(),
                message: "Passwords must be identical"
            }
        });
        this.error = ko.observable();
        this.errors = ko.validation.group(this);

        this.loadUserInfo();
    }

    ViewModel.prototype.loadUserInfo = function() {
        var me = this;
        userContext.loadUserInfo().done(function(data) {
            me.email(data.email);
            me.login(data.username);
        });
    };

    ViewModel.prototype.canActivate = function () {
        return userContext.isLoggedIn() ? true : {redirect: 'login'};
    };

    ViewModel.prototype.saveSettings = function() {
        if (this.errors().length == 0) {

        } else this.errors.showAllMessages();
    };

    return new ViewModel();
});