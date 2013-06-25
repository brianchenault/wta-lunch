'use strict';
//var watlunch = angular.module('watlunch', ['firebase']);

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
            var name = user.displayName !== '' ? user.displayName : user.username;
            $('.welcome').html('Welcome, ' + name);
        } else {
            // user is logged out
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
                alert();
                $scope.restaurants.add({name: $scope.restaurant});
            }
        }
    ])
    .directive('autoScroll', function($timeout) {
        return function(scope, elements, attrs) {
            scope.$watch("restaurants.length", function() {
                $timeout(function() {
                    elements[0].scrollTop = elements[0].scrollHeight;
                });
            });
        }
    });