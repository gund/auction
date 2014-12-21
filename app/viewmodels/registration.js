define(['knockout', 'userContext', 'plugins/router', 'knockout.validation'], function (ko, userContext, router, validation) {

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
                message: "Email is required."
            },
            email: true
        }),
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
            document.querySelector('#spinner').show();
            userContext.signup(viewModel.login(), viewModel.email(), viewModel.password())
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
                })
                .finally(function(){
                    document.querySelector('#spinner').hide();
                });
        } else {
            viewModel.errors.showAllMessages();
        }
    }

    return viewModel;
});