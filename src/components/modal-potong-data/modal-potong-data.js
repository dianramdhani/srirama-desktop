angular.module('myApp')
    .component('modalPotongData', {
        bindings: {
            modalPotongDataShow: '=',
            spatialCrop: '&',
            restoreSpatialCropped: '&'
        },
        template: require('./modal-potong-data.html')
    })