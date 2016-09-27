;(function() {
    
    'use strict';
    
    var injectParams = [
		'$scope',
		'$rootScope',
		'$element',
		'Notes',
		'User'
	];
	
    var NotesFormController = function($scope, $rootScope, $element, notes, user) {
        var _defaults = {
            text: '',
            date: new Date(),
            spent: 1
        };
        
        $scope.noteData = angular.extend({}, _defaults);
        
        $rootScope.$on('openNotesFormEvent', function(event, data) {
            if (data && typeof data === 'object') {
                $scope.noteData = {
                    id: data.id,
                    text: data.text,
                    date: new Date(data.date),
                    spent: parseInt(data.spent, 10)
                };
            }
            else {
                $scope.noteData = angular.extend({}, _defaults);
            }
            
            $scope.ui.notesForm.errorText = '';
        });
        
        $scope.save = function() {
            $scope.ui.notesForm.errorText = '';
            
            if ($scope.noteData.id) {
                notes.update($scope.noteData.id, $scope.noteData, callback);
            } else {
                notes.create($scope.noteData, callback);
            }
            
            function callback(err) {
                if (err) {
                    $scope.ui.notesForm.errorText = err;
                    return;
                }
                
                $rootScope.$broadcast('refreshNotesListEvent');
                $element.modal('hide');
            }
        }
    }
    
    NotesFormController.$inject = injectParams;
    
    angular.module('testApp').controller('NotesFormController', NotesFormController);
    
})();
