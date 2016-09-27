;(function() {
    
    'use strict';
    
    var injectParams = [
		'$rootScope',
		'$http',
		'$q'
	];
	
	var User = function($rootScope, $http, $q) {
	    
	    var UserModel = function(data) {
	        if (data) {
	            this.setData(data);
	        }
	    }
	    
	    UserModel.prototype.setData = function(data) {
	        angular.extend(this, data);
	    }
	    
	    UserModel.prototype.reset = function() {
	        for (var prop in this) {
	            if (typeof this[prop] !== 'function') {
	                delete this[prop];
	            }
	        }
	    }
	    
	    UserModel.prototype.isloggedin = function() {}
	    
	    UserModel.prototype.login = function(data) {
	        var deferred = $q.defer();
	        
	        var successCallback = function(res) {
                this.setData(res.data);
                $rootScope.accessToken = res.token;
                deferred.resolve(res.data);
	        }
	        
	        var errorCallback = function(res) {
                deferred.reject(res.message);
	        }
	        
	        $http({
                method: 'POST',
                url: $rootScope.apiUrl + '/signin',
                data: data
            }).success(successCallback.bind(this)).error(errorCallback);
            
            return deferred.promise;
	    }
	    
	    UserModel.prototype.signup = function(data) {
	        var deferred = $q.defer();
	        
	        var successCallback = function(res) {
	            deferred.resolve(res.data);
	        }
	        
	        var errorCallback = function(res) {
	            deferred.reject(res.message);
	        }
	        
	        $http({
                method: 'POST',
                url: $rootScope.apiUrl + '/signup',
                data: data
            }).success(successCallback).error(errorCallback);
	        
	        return deferred.promise;
	    }
	    
	    UserModel.prototype.logout = function() {
	    	$rootScope.accessToken = '';
	    	this.reset();
	    }
	    
	    var userInstance = new UserModel();
	    
	    return userInstance;
	}
	
	User.$inject = injectParams;
	
	angular.module('testApp').factory('User', User);
    
})();
