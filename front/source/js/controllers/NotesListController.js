;(function() {
    
    'use strict';
    
    var injectParams = [
		'$scope',
		'$rootScope',
		'Notes'
	];
	
    var NotesListController = function($scope, $rootScope, notes) {
        $scope.notesData = {};
        
        $scope.notesRead = function() {
            if ($scope.ui.isAuthorized) {
                notes.read().then(function(data) {
                    var hasNotes = Boolean(Object.keys(data).length);
                    
                    $scope.ui.notesList.showEmptyText = !hasNotes;
                    
                    if (!hasNotes) {
                        $scope.notesData = data;
                        return;
                    }
                    
                    // preparing notes data
                    var entryResult = {};
                    
                    for (var id in data) {
                        var note = data[id],
                            date = new Date(note.date).toDateString();
                        
                        if (!entryResult[date]) {
                            entryResult[date] = [];
                        }
                        
                        entryResult[date].push(angular.extend({ id: id }, note));
                    }
                    
                    // sorting notes by date
                    var sortedDates = Object.keys(entryResult).sort(function(a, b) {
                        return new Date(b) - new Date(a);
                    });
                    
                    var finalResult = {};
                    
                    sortedDates.forEach(function(date) {
                        var dateKey = date.split(' ').slice(1).join(' ');
                        finalResult[dateKey] = entryResult[date];
                    });
                    
                    $scope.notesData = finalResult;
                });
            }
        }
        
        $rootScope.$on('refreshNotesListEvent', $scope.notesRead);
        $scope.$watch('ui.isAuthorized', $scope.notesRead);
    }
    
    NotesListController.$inject = injectParams;
    
    angular.module('testApp').controller('NotesListController', NotesListController);
    
})();
