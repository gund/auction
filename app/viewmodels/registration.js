define(['knockout', 'userContext', 'plugins/router', 'knockout.validation', 'jquery'], function (ko, userContext, router, validation, $) {

    ko.validation.configure({
        registerExtenders: false,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: false,
        messageTemplate: null
    });

    var viewModel = {
        email: ko.observable().extend({
            required: {
                params: true,
                message: "Email is required"
            },
            email: true
        }),
        login: ko.observable().extend({
            required: {
                params: true,
                message: "Login is required"
            },
            minLength: 3
        }),
        password: ko.observable().extend({
            required: {
                params: true,
                message: "Password is required"
            },
            minLength: 6
        }),

        submit: submit
    };

    viewModel.errors = ko.validation.group(viewModel);

    function submit() {
        if (viewModel.errors().length == 0) {
            userContext.signup(viewModel.login(), viewModel.email(), viewModel.password())
                .then(function () {
                    if (userContext.isLoggedIn()) {
                        router.navigate('');
                        location.reload();
                    }
                })
                .catch(function (e) {
                    var serverErrorCode = JSON.parse(e.responseText).code;
                    if (serverErrorCode == 202) {
                        alert('user is already exist');
                    }
                });
        } else {
            viewModel.errors.showAllMessages();
        }
    }

    return viewModel;
});