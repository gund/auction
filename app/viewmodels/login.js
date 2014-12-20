define(['knockout', 'userContext', 'plugins/router', 'knockout.validation'], function (ko, userContext, router, validation) {

    ko.validation.configure({
        registerExtenders: false,
        messagesOnModified: true,
        insertMessages: false,
        parseInputAttributes: false,
        messageTemplate: true
    });

    var viewModel = {
        login: ko.observable().extend({
            required: {
                params: true,
                message: "Login is required."
            },
            minLength: 3
        }),
        password: ko.observable().extend({
            required: {
                params: true,
                message: "Password is required."
            },
            minLength: 6
        }),

        submit: submit
    };

    viewModel.errors = ko.validation.group(viewModel);

    function submit() {
        if (viewModel.errors().length == 0) {
            userContext.signin(viewModel.login(), viewModel.password())
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