define(['knockout', 'userContext', 'knockout.validation', 'plugins/router'], function (ko, userContext, validation, router) {

    ko.validation.configure({
        registerExtenders: false,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: false,
        messageTemplate: null
    });

    function ViewModel() {
        this.formLoading = ko.observable(false);
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
        this.password = ko.observable('').extend({
            minLength: 6
        });
        this.newPassword = ko.observable('').extend({
            minLength: 6,
            equal: {
                params: this.password,
                message: "Passwords must be identical"
            }
        });
        this.error = ko.observable();
        this.errors = ko.validation.group(this);
    }

    ViewModel.prototype.activate = function() {
        this.loadUserInfo();
        this.password('');
        this.newPassword('');
    };

    ViewModel.prototype.loadUserInfo = function () {
        var me = this;
        this.formLoading(true);
        var progress = userContext.loadUserInfo();
        progress.done(function (data) {
            me.email(data.email);
            me.login(data.username);
        });
        progress.finally(function () {
            me.formLoading(false);
        });
    };

    ViewModel.prototype.canActivate = function () {
        return userContext.isLoggedIn() ? true : {redirect: 'login'};
    };

    ViewModel.prototype.saveSettings = function () {
        var me = this;
        if (this.errors().length == 0) {
            document.querySelector('#spinner').show();
            var user2update = {
                email: this.email,
                username: this.login
            };
            if (this.password() != "") user2update.password = this.password();
            var progress = userContext.saveUserInfo(user2update);
            progress.done(function() {
                router.navigate('all');
            });
            progress.catch(function (e) {
                me.error(JSON.parse(e.responseText).error);
                document.querySelector('#errorToast').show();
            });
            progress.finally(function () {
                document.querySelector('#spinner').hide();
            });
        } else this.errors.showAllMessages();
    };

    return new ViewModel();
});
