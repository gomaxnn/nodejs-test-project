;(function() {
    
    'use strict';
    
    var injectParams = [
		'$scope',
		'User'
	];
	
	var SignupController = function($scope, user) {
	    var _defaults = {
	        name: '',
	        email: '',
	        password: '',
	        password_confirm: ''
	    };
	    
	    $scope.signupData = angular.extend({}, _defaults);
        
        $scope.signup = function() {
            $scope.ui.userBlock.resetAlertText();
            
            var successCallback = function(data) {
                $scope.signupData = angular.extend({}, _defaults);
                $scope.ui.userBlock.toggleForms();
                $scope.ui.userBlock.successText = 'Your account has been created successfully.';
            }
            
            var errorCallback = function(err) {
                $scope.ui.userBlock.errorText = err;
            }
            
            user.signup($scope.signupData).then(successCallback, errorCallback);
        }
	}
	
	SignupController.$inject = injectParams;
    
    angular.module('testApp').controller('SignupController', SignupController);
    
})();
