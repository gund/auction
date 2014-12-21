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
        error: ko.observable(),
        submit: submit,
        canActivate: canActivate
    };

    function canActivate() {
        if (userContext.isLoggedIn()) {
            return { redirect: 'all' };
        }

        return true;
    }
    viewModel.errors = ko.validation.group(viewModel);

    function submit() {
        if (viewModel.errors().length == 0) {
            userContext.signin(viewModel.login(), viewModel.password())
                .then(function () {
                    if (userContext.isLoggedIn()) {
                        router.navigate('all');
                        router.updateMenu(userContext.isLoggedIn());
                    }
                })
                .catch(function (e) {
                    var serverErrorMessage = JSON.parse(e.responseText).error;
                    viewModel.error(serverErrorMessage);
                    document.querySelector('#errorToast').show();
                });
        } else {
            viewModel.errors.showAllMessages();
        }
    }

    return viewModel;
});