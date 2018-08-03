angular.module('myApp')
    .component('modalPotongData', {
        bindings: {
            modalPotongDataShow: '=',
            spatialCrop: '&',
            restoreSpatialCropped: '&'
        },
        templateUrl: './components/modal-potong-data/modal-potong-data.html'
    })