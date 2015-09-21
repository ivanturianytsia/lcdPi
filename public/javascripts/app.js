var app = angular.module('app', []);

app.factory('Socket', function($rootScope) {
    var socket = io.connect();
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.controller('main', ['$scope', 'Socket',
    function($scope, Socket) {
        $scope.avalible = false;
        $scope.message = '';
        $scope.send = function() {
            Socket.emit('message', {
                content: $scope.message
            })
        }
        Socket.on('avalible', function(data) {
            $scope.avalible = data;
        });
    }
]);