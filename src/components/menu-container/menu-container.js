angular.module('myApp')
    .component('menuContainer', {
        bindings: {
            selectDimension: '&',
            footerShow: '&',
            selectLocation: '&',
            modalCariNilaiMinMaxShow: '='
        },
        templateUrl: './components/menu-container/menu-container.html'
    })