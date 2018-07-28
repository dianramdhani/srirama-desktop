angular.module('myApp')
    .component('menuContainer', {
        bindings: {
            selectDimension: '&',
            footerShow: '&',
            selectLocation: '&'
        },
        templateUrl: './components/menu-container/menu-container.html'
    })