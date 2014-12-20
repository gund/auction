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
        error: ko.observableArray(),
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
                    var serverErrorMessage = JSON.parse(e.responseText).error;
                    viewModel.error([]);
                    viewModel.error.push({'errorText': serverErrorMessage});
                });
        } else {
            viewModel.errors.showAllMessages();
        }
    }

    return viewModel;
});