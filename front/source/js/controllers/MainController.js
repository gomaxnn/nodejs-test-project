;(function() {
    
    'use strict';
    
    var injectParams = [
		'$scope',
		'$rootScope'
	];
	
    var MainController = function($scope, $rootScope) {
        var _loc = {
            USER_SIGNUP: 'Create a new account',
            USER_SIGNIN: 'Have an account? Log in',
            NF_TITLE_CREATE: 'Create Note',
            NF_TITLE_UPDATE: 'Update Note',
            NF_SUBMIT_CREATE: 'Create',
            NF_SUBMIT_UPDATE: 'Update'
        };
        
        var userBlock = {
            showLogin: true,
            showSignup: false,
            successText: '',
            errorText: '',
            toggleText: _loc.USER_SIGNUP,
            toggleForms: function(e) {
                e && e.preventDefault();
                this.showLogin = !this.showLogin;
                this.showSignup = !this.showSignup;
                this.toggleText = this.showLogin ? _loc.USER_SIGNUP : _loc.USER_SIGNIN;
                this.resetAlertText();
            },
            resetAlertText: function() {
                this.successText = '';
                this.errorText = '';
            }
        };
        
        var notesForm = {
            errorText: '',
            titleText: '',
            submitText: '',
            open: function(data) {
                this.titleText = data ? _loc.NF_TITLE_UPDATE : _loc.NF_TITLE_CREATE
                this.submitText = data ? _loc.NF_SUBMIT_UPDATE : _loc.NF_SUBMIT_CREATE
                $rootScope.$broadcast('openNotesFormEvent', data);
            }
        };
        
        var notesList = {
            showEmptyText: false
        };
        
        var notesDeleteAlert = {
            open: function(id) {
                $rootScope.$broadcast('openNotesDeleteAlertEvent', id);
            }
        };
        
        $scope.ui = {
            isAuthorized: false,
            userBlock: userBlock,
            notesForm: notesForm,
            notesList: notesList,
            notesDeleteAlert: notesDeleteAlert
        };
        
        $rootScope.$watch('accessToken', function() {
            $scope.ui.isAuthorized = Boolean($rootScope.accessToken);
        });
    }
    
    MainController.$inject = injectParams;
    
    angular.module('testApp').controller('MainController', MainController);
    
})();
