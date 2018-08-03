angular.module('myApp')
    .component('menuContainer', {
        bindings: {
            selectDimension: '&',
            footerShow: '&',
            selectLocation: '&',
            modalCariNilaiMinMaxShow: '=',
            modalPotongDataShow: '='
        },
        templateUrl: './components/menu-container/menu-container.html'
    })