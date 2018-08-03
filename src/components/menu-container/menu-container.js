angular.module('myApp')
    .component('menuContainer', {
        bindings: {
            selectDimension: '&',
            footerShow: '&',
            selectLocation: '&',
            spatialCrop: '&',
            modalCariNilaiMinMaxShow: '='
        },
        templateUrl: './components/menu-container/menu-container.html'
    })