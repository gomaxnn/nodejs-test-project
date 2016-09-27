;(function() {
    
    'use strict';
    
    var injectParams = [
		'$scope',
		'Notes',
		'User'
	];
	
    var HeaderController = function($scope, notes, user) {
        $scope.logout = function(e) {
            e && e.preventDefault();
            user.logout();
            notes.reset();
        }
    }
    
    HeaderController.$inject = injectParams;
    
    angular.module('testApp').controller('HeaderController', HeaderController);
    
})();
