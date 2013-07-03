'use strict';

(function() {

    var watlunch = angular.module('session', ['firebase']),
        session = {
            baseurl: 'https://watlunch.firebaseIO.com/',
            thedate: moment().format("YYYYMMDD"),
            username: sessionStorage['watlunch_username'] ?
                sessionStorage['watlunch_username'] : ''
        };

    angular.module('WatLunch', ['firebase']).controller(
        'watlunch', ['$scope', '$timeout', 'angularFireCollection',
            function($scope, $timeout, angularFireCollection) {

                var url = session.baseurl + 'restaurants';
                $scope.restaurants = angularFireCollection(new Firebase(url).limit(50));
                $scope.isUserAuthenticated = (sessionStorage['watlunch_username'] || $scope.isUserAuthenticated) ? true : false;

                $scope.addRestaurant = function() {
                    $scope.restaurants.add({name: $scope.restaurant});
                };

                $scope.githubLogin = function() {
                    session.authClient.login('github', {
                        rememberMe: true,
                        scope: 'user'
                    });
                };

                $scope.facebookLogin = function() {
                    session.authClient.login('facebook', {
                        rememberMe: true,
                        scope: 'email'
                    });
                };

                $scope.twitterLogin = function() {
                    session.authClient.login('twitter', {
                        rememberMe: true
                    });
                };

                $scope.logout = function() {
                    session.authClient.logout();
                    $scope.isUserAuthenticated = false;
                    $scope.welcome = '';
                };

                $scope.userHasVoted = function() {
                    return sessionStorage['userVoted'];
                };

                $scope.vote = function(restaurant, votes) {
                    var url = session.baseurl + 'restaurants/' + restaurant.$id + '/votes/' + session.thedate ;
                    restaurant.votes = angularFireCollection(new Firebase(url).limit(50));
                    restaurant.votes.add({name: session.username});
                    sessionStorage.userVoted = true;
                };

                $scope.firebaseAuthCallback = function(error, user) {

                    if (error) {

                        // an error occurred while attempting login
                        console.log(error);

                    } else if (user) {

                        // user authenticated with Firebase
                        session.username = user.displayName !== '' ? user.displayName : user.username;
                        sessionStorage['watlunch_username'] = session.username;

                        $scope.$apply(function () {
                            $scope.isUserAuthenticated = true;
                            $scope.welcome = 'Welcome, ' + session.username;
                        });

                    } else {

                        // user is logged out
                        $scope.isUserAuthenticated = false;

                    }
                };

                session.authClient = new FirebaseAuthClient(new Firebase(session.baseurl), $scope.firebaseAuthCallback);

                /*
                 $scope.theSort = function(restaurant) {
                 var votes =_.toArray(restaurant.votes[session.thedate]);
                 return votes.length;
                 };
                 */
            }
        ]);
})();
