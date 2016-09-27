;(function() {
    
    'use strict';
    
    var injectParams = [
		'$scope',
		'Notes',
        'User'
	];
	
	var LoginController = function($scope, notes, user) {
	    var _defaults = {
	        email: '',
	        password: ''
	    };
	    
	    $scope.loginData = angular.extend({}, _defaults);
        
        $scope.login = function() {
            $scope.ui.userBlock.resetAlertText();
            
            var successCallback = function(data) {
                $scope.loginData = angular.extend({}, _defaults);
            }
            
            var errorCallback = function(err) {
                $scope.ui.userBlock.errorText = err;
            }
            
            user.login($scope.loginData).then(successCallback, errorCallback);
        }
	}
	
	LoginController.$inject = injectParams;
    
    angular.module('testApp').controller('LoginController', LoginController);
    
})();
