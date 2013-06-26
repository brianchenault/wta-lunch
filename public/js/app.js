'use strict';

var watlunch = angular.module('WatLunch', ['firebase']),
    WatLunch = {};
WatLunch.username = '';
WatLunch.thedate = moment().format("YYYYMMDD");

var firebase = new Firebase('https://watlunch.firebaseIO.com/'),
    authClient = new FirebaseAuthClient(firebase, function(error, user) {
        if (error) {
            // an 0error occurred while attempting login
            console.log(error);
        } else if (user) {
            // user authenticated with Firebase
            //console.log(user);
            $('.auth .in').hide();
            $('.auth .out, .right').show();
            window.WatLunch.username = user.displayName !== '' ? user.displayName : user.username;
            $('.welcome').html('Welcome, ' + window.WatLunch.username);
        } else {
            // user is logged out
            $('.auth .out, .right').hide();
        }
    });

$('.login.btn-github').click(function() {
    authClient.login('github', {
        rememberMe: true,
        scope: 'user'
    });
});

$('.login.btn-facebook').click(function() {
    authClient.login('facebook', {
        rememberMe: true,
        scope: 'email'
    });
});

$('.login.btn-twitter').click(function() {
    authClient.login('twitter', {
        rememberMe: true
    });
});

$('.out a').click(function() {
    authClient.logout();
    $('.auth .in').show();
    $('.auth .out, .right').hide();
    $('.welcome').html('');
});

angular.module('WatLunch', ['firebase'])
    .controller('watlunch', ['$scope', '$timeout', 'angularFireCollection',
        function($scope, $timeout, angularFireCollection) {
            var url = 'https://watlunch.firebaseIO.com/restaurants';
            $scope.restaurants = angularFireCollection(new Firebase(url).limit(50));

            $scope.addRestaurant = function() {
                $scope.restaurants.add({name: $scope.restaurant});
            }
            $scope.vote = function(restaurant) {
                var url = 'https://watlunch.firebaseIO.com/restaurants/' + restaurant.$id + '/votes/' + WatLunch.thedate ;
                restaurant.votes = angularFireCollection(new Firebase(url).limit(50));
                restaurant.votes.add({name: window.WatLunch.username});
                console.log(restaurant.votes);

                $('.vote').hide();
            }
        }
    ]);