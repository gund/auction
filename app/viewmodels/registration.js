define(['knockout', 'userContext', 'plugins/router'], function (ko, userContext, router) {

    var viewModel = {

        email: ko.observable(),
        login: ko.observable(),
        password: ko.observable(),

        submit: submit
        //canActivate: canActivate
    };

    return viewModel;

    //function canActivate() {
    //    if (userContext.session) {
    //        return { redirect: '' };
    //    }
    //
    //    return true;
    //}

    function submit() {
        userContext.signup(viewModel.login(), viewModel.email(), viewModel.password())
            .then(function () {
                router.navigate('home');
            })
            .catch(function () {
                // handle error
            })
    }

})