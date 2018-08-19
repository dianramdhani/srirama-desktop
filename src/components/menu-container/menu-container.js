angular.module('myApp')
    .component('menuContainer', {
        bindings: {
            selectDimension: '&',
            footerShow: '&',
            selectLocation: '&',
            modalCariNilaiMinMaxShow: '=',
            modalPotongDataShow: '='
        },
        template: require('./menu-container.html')
    })