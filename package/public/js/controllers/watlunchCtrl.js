'use strict';

todomvc.controller('TodoCtrl', ['$scope', '$location', 'angularFire', 'filterFilter',
    function TodoCtrl($scope, $location, angularFire, filterFilter) {
        var url = "https://watlunch.firebaseIO.com";
        var promise = angularFire(url, $scope, 'restaurants');

        $scope.newTodo = '';
        $scope.editedTodo = null;

        if ($location.path() === '') {
            $location.path('/');
        }
        $scope.location = $location;

        promise.then(function(todos) {
            startWatch($scope, filterFilter);
        });
    }
]);

function startWatch($scope, filter) {
    $scope.$watch('todos', function () {
        $scope.remainingCount = filter($scope.todos, {completed: false}).length;
        $scope.completedCount = $scope.todos.length - $scope.remainingCount;
        $scope.allChecked = !$scope.remainingCount;
    }, true);

    $scope.$watch('location.path()', function (path) {
        $scope.statusFilter = (path === '/active') ?
        { completed: false } : (path === '/completed') ?
        { completed: true } : null;
    });

    $scope.addTodo = function () {
        if (!$scope.newTodo.length) {
            return;
        }

        $scope.todos.push({
            title: $scope.newTodo,
            completed: false
        });

        $scope.newTodo = '';
    };

    $scope.editTodo = function (todo) {
        $scope.editedTodo = todo;
    };

    $scope.doneEditing = function (todo) {
        $scope.editedTodo = null;
        if (!todo.title) {
            $scope.removeTodo(todo);
        }
    };

    $scope.removeTodo = function (todo) {
        $scope.todos.splice($scope.todos.indexOf(todo), 1);
    };

    $scope.clearCompletedTodos = function () {
        $scope.todos = $scope.todos.filter(function (val) {
            return !val.completed;
        });
    };

    $scope.markAll = function (completed) {
        $scope.todos.forEach(function (todo) {
            todo.completed = completed;
        });
    };
}
