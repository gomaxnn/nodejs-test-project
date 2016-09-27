;(function() {
    
    'use strict';
    
    var injectParams = [
		'$scope',
		'$rootScope',
		'$element',
		'Notes'
	];
	
    var NotesDeleteAlertController = function($scope, $rootScope, $element, notes) {
        var _defaults = {
            id: null
        };
        
        $scope.noteData = angular.extend({}, _defaults);
        
        $rootScope.$on('openNotesDeleteAlertEvent', function(event, id) {
            $scope.noteData = id ? { id: id } : angular.extend({}, _defaults);
        });
        
        $scope.delete = function() {
            if (!$scope.noteData.id) {
                $element.modal('hide');
                return;
            }
            
            notes.delete($scope.noteData.id, function(err) {
                if (!err) {
                    $rootScope.$broadcast('refreshNotesListEvent');
                    $element.modal('hide');
                }
            });
        }
    }
    
    NotesDeleteAlertController.$inject = injectParams;
    
    angular.module('testApp').controller('NotesDeleteAlertController', NotesDeleteAlertController);
    
})();
