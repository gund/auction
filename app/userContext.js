define(['Q', 'plugins/http'], function (Q, http) {

    var userContext = {
        isLoggedIn: isLoggedIn,
        signin: signin,
        signup: signup,
        session: null
    };

    return userContext;

    function isLoggedIn() {
        var userID = localStorage.getItem('userID');
        // localStorage.removeItem(undefined);
        if (userID) {
            return true;
        } else {
            return false;
        }
    }

    function signup(login, email, password) {
        var dfd = Q.defer();

        var url = 'https://api.parse.com/1/users/';
        var headers = {
            "X-Parse-Application-Id": "5aANDFPFiBGti8xHjR52GsO6DP6GpT6LzIr7q9X6",
            "X-Parse-REST-API-Key": "RclC9e0afgL4oQhfauYPQZhU5NOJUVQHyr66JK6v"
        };

        var user = {
            username: login,
            email: email,
            password: password
        };

        http.post(url, user, headers)
            .done(function (response) {
                userContext.session = response;
                localStorage.setItem('userID', response.objectId);
                dfd.resolve();
            })
            .fail(function (e) {
                dfd.reject(e);
            });

        return dfd.promise;
    }

    function signin(login, password) {
        var dfd = Q.defer();

        var url = 'https://api.parse.com/1/login/';
        var headers = {
            "X-Parse-Application-Id": "5aANDFPFiBGti8xHjR52GsO6DP6GpT6LzIr7q9X6",
            "X-Parse-REST-API-Key": "RclC9e0afgL4oQhfauYPQZhU5NOJUVQHyr66JK6v"
        }

        var user = {
            username: login,
            password: password
        };

        http.get(url, user, headers)
            .done(function (response) {
                if (response) {
                    userContext.session = response;
                    localStorage.setItem('userID', response.objectId);
                    dfd.resolve();
                } else {
                    dfd.reject(response);
                }

            })
            .fail(function (e) {
                dfd.reject(e);
            });

        return dfd.promise;
    }

});