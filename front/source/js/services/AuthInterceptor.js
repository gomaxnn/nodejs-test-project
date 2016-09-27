;(function() {
    
    'use strict';
    
    angular.module('testApp').factory('AuthInterceptor', ['$rootScope', '$q', function($rootScope, $q) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                
                if ($rootScope.accessToken) {
                    config.headers['X-Access-Token'] = $rootScope.accessToken;
                }
                
                return config;
            },
            response: function(response) {
                if (response.status === 401) {
                    $rootScope.accessToken = '';
                }
                
                return response || $q.when(response);
            }
        }
    }]);
    
})();
