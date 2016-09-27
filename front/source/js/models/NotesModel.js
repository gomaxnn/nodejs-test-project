;(function() {
    
    'use strict';
    
    var injectParams = [
		'$rootScope',
		'$http',
		'$q'
	];
	
	var Notes = function($rootScope, $http, $q) {
	    
	    var NotesModel = function(data) {
	        if (data) {
	            this.setData(data);
	        }
	    }
	    
	    NotesModel.prototype.setData = function(data) {
	        angular.extend(this, data);
	    }
	    
	    NotesModel.prototype.create = function() {
	        var deferred = $q.defer();
	        
	        var successCallback = function(res) {
	            deferred.resolve(res.data);
	        }
	        
	        var errorCallback = function(res) {
	            deferred.reject(res.message);
	        }
	        
	        $http({
                method: 'POST',
                url: $rootScope.apiUrl + '/notes',
                data: this
            }).success(successCallback).error(errorCallback);
            
            return deferred.promise;
	    }
	    
	    NotesModel.prototype.update = function() {
	    	var deferred = $q.defer();

			var successCallback = function(res) {
				this.setData(res.data);
				deferred.resolve(res.data);
			}

			var errorCallback = function(res) {
				deferred.reject(res.message);
			}

			$http({
				method: 'PUT',
				url: $rootScope.apiUrl + '/notes/' + this.id,
				data: this
			}).success(successCallback.bind(this)).error(errorCallback);

			return deferred.promise;
	    }
	    
	    NotesModel.prototype.delete = function() {
	    	var deferred = $q.defer();

			var successCallback = function(res) {
				deferred.resolve();
			}

			var errorCallback = function(res) {
				deferred.reject(res.message);
			}

			$http({
				method: 'DELETE',
				url: $rootScope.apiUrl + '/notes/' + this.id
			}).success(successCallback).error(errorCallback);

			return deferred.promise;
	    }
	    
	    var notesManager = {
	    	_pool: {},
	    	_fetched: false, // is data received from server
	    	_retrieveInstance: function(id, data) {
	    		var instance = this._pool[id];

				if (instance) {
					instance.setData(data);
				}
				else {
					instance = new NotesModel(data);
					this._pool[id] = instance;
				}

				return instance;
	    	},
	    	reset: function() {
				this._pool = {};
				this._fetched = false;
			},
			create: function(data, cb) {
				var instance = new NotesModel();
				
				instance.setData(data);
				
				var successCallback = function(data) {
					this._pool[data.id] = angular.extend(instance, data);

					if (cb && typeof cb === 'function') {
						cb(null, data);
					}
				}

				var errorCallback = function(err) {
					if (cb && typeof cb === 'function') {
						cb(err);
					}
				}
				
				instance.create().then(successCallback.bind(this), errorCallback);
			},
			read: function() {
				var deferred = $q.defer(),
					scope = this;
				
				if (this._fetched && typeof this._pool === 'object') {
					deferred.resolve(this._pool);
					return deferred.promise;
				}
				
				var successCallback = function(res) {
					res.data.forEach(function(data) {
						scope._retrieveInstance(data.id, data);
					});

					scope._fetched = true;
					deferred.resolve(scope._pool);
				}
				
				var errorCallback = function(err) {
					deferred.reject();
				}
				
				$http({
					method: 'GET',
					url: $rootScope.apiUrl + '/notes'
				}).success(successCallback).error(errorCallback);

				return deferred.promise;
			},
			update: function(id, data, cb) {
				if (!this._pool[id] || typeof data !== 'object') {
					return;
				}

				var instance = new NotesModel();

				instance.setData(data);

				var successCallback = function(data) {
					this._pool[data.id].setData(data);

					if (cb && typeof cb === 'function') {
						cb(null);
					}
				}

				var errorCallback = function(err) {
					if (cb && typeof cb === 'function') {
						cb(err);
					}
				}

				instance.update().then(successCallback.bind(this), errorCallback);
			},
			delete: function(id, cb) {
				var instance = this._pool[id];
				
				if (!instance) {
					return;
				}
				
				var successCallback = function() {
					delete this._pool[id];
					
					if (cb && typeof cb === 'function') {
						cb(null);
					}
				}
				
				var errorCallback = function(err) {
					if (cb && typeof cb === 'function') {
						cb(err);
					}
				}
				
				instance.delete().then(successCallback.bind(this), errorCallback);
			}
	    };
	    
	    return notesManager;
	}
	
	Notes.$inject = injectParams;
	
	angular.module('testApp').factory('Notes', Notes);
    
})();
