define(['Q', 'plugins/http', 'durandal/app'], function (Q, http, app) {

    var userContext = {
        isLoggedIn: isLoggedIn,
        signin: signin,
        signup: signup,
        logout: logout,
        getUserId: getUserId,
        getSessionToken: getSessionToken,
        loadUserInfo: loadUserInfo,
        saveUserInfo: saveUserInfo,
        session: null
    };

    return userContext;

    function isLoggedIn() {
        var userID = localStorage.getItem('userID');
        if (userID) {
            return true;
        } else {
            return false;
        }
    }

    function signup(login, email, password) {
        var dfd = Q.defer();

        var url = 'https://api.parse.com/1/users/';

        var user = {
            username: login,
            email: email,
            password: password
        };

        http.post(url, user, app.parseHeaders)
            .done(function (response) {
                userContext.session = response.sessionToken;
                localStorage.setItem('userID', response.objectId);
                localStorage.setItem('sessionToken', response.sessionToken);
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

        var user = {
            username: login,
            password: password
        };

        http.get(url, user, app.parseHeaders)
            .done(function (response) {
                if (response) {
                    userContext.session = response.sessionToken;
                    localStorage.setItem('userID', response.objectId);
                    localStorage.setItem('sessionToken', response.sessionToken);
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

    function logout() {
        if (!userContext.isLoggedIn()) return;
        localStorage.removeItem('userID');
        localStorage.removeItem('sessionToken');
        userContext.session = null;
    }

    function getUserId() {
        return localStorage.getItem('userID');
    }

    function getSessionToken() {
        return localStorage.getItem('sessionToken');
    }

    function loadUserInfo() {
        var dfd = Q.defer();
        var url = "https://api.parse.com/1/users/" + userContext.getUserId();

        http.get(url, null, app.parseHeaders)
            .done(function (response) {
                if (response) {
                    dfd.resolve(response);
                } else {
                    dfd.reject();
                }
            })
            .fail(function (e) {
                dfd.reject(e);
            });

        return dfd.promise;
    }

    function saveUserInfo(user) {
        var dfd = Q.defer();
        var url = "https://api.parse.com/1/users/" + userContext.getUserId();

        var headers = app.parseHeaders;
        headers["X-Parse-Session-Token"] = getSessionToken();

        http.put(url, user, app.parseHeaders)
            .then(function (data) {
                dfd.resolve(data);
            }, function (e) {
                dfd.reject(e);
            });

        return dfd.promise;
    }

});