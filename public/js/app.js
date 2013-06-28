'use strict';

(function() {

    var watlunch = angular.module('WatLunch', ['firebase']),
        WatLunch = {
            baseurl: 'https://watlunch.firebaseIO.com/',
            thedate: moment().format("YYYYMMDD"),
            username: localStorage['watlunch_username'] ?
                localStorage['watlunch_username'] : ''
        };

    angular.module('WatLunch', ['firebase'])
        .controller('watlunch', ['$scope', '$timeout', 'angularFireCollection',
            function($scope, $timeout, angularFireCollection) {
                var url = WatLunch.baseurl + 'restaurants';
                $scope.restaurants = angularFireCollection(new Firebase(url).limit(50));
                var userVoted = false;

                $scope.addRestaurant = function() {
                    $scope.restaurants.add({name: $scope.restaurant});
                }

                $scope.vote = function(restaurant) {
                    var url = WatLunch.baseurl + '/restaurants/' + restaurant.$id + '/votes/' + WatLunch.thedate ;
                    restaurant.votes = angularFireCollection(new Firebase(url).limit(50));
                    restaurant.votes.add({name: WatLunch.username});
                    //$('.vote').remove();
                    userVoted = true;
                }

                $scope.githubLogin = function() {
                    WatLunch.authClient.login('github', {
                        rememberMe: true,
                        scope: 'user'
                    });
                }

                $scope.facebookLogin = function() {
                    WatLunch.authClient.login('facebook', {
                        rememberMe: true,
                        scope: 'email'
                    });
                }

                $scope.twitterLogin = function() {
                    WatLunch.authClient.login('twitter', {
                        rememberMe: true
                    });
                }

                $scope.logout = function() {
                    WatLunch.authClient.logout();
                    $('.auth .out, .right').hide();
                    $('.welcome').html('');
                };

                $scope.userHasVoted = function() {
                    return userVoted;
                };

                WatLunch.authClient = new FirebaseAuthClient(new Firebase(WatLunch.baseurl),
                    function(error, user) {
                        $scope.user = user;

                        if (error) {
                            // an error occurred while attempting login
                            console.log(error);
                        } else if (user) {
                            // user authenticated with Firebase
                            $('.auth .out, .main').show();
                            WatLunch.username = user.displayName !== '' ? user.displayName : user.username;
                            localStorage['watlunch_username'] = WatLunch.username;
                            $('.welcome').html('Welcome, ' + WatLunch.username);
                        } else {
                            // user is logged out
                            $('.auth .out, .main').hide();
                        }
                    });
                }
        ]);
})();
