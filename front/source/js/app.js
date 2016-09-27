/**
 * Third party
 */
//= ../../bower_components/jquery/dist/jquery.slim.min.js
//= ../../bower_components/bootstrap/dist/js/bootstrap.min.js
//= ../../bower_components/angular/angular.min.js

/**
 * Application
 */
;(function() {
    
    'use strict';
    
    angular.module('testApp', [
        // 'ngRoute'
    ])
    .config(config)
    .run(run);
    
    config.$inject = [
        '$httpProvider'
    ];
    
    function config($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }
    
    run.$inject = [
        '$rootScope'
    ];
    
    function run($rootScope) {
        $rootScope.apiUrl = 'http://sword-fish.ru:9000';
        $rootScope.accessToken = '';
    }
    
})();

/**
 * Controllers
 */
//= controllers/MainController.js
//= controllers/HeaderController.js
//= controllers/LoginController.js
//= controllers/SignupController.js
//= controllers/NotesFormController.js
//= controllers/NotesListController.js
//= controllers/NotesDeleteAlertController.js

/**
 * Models
 */
//= models/UserModel.js
//= models/NotesModel.js

/**
 * Services
 */
//= services/AuthInterceptor.js
