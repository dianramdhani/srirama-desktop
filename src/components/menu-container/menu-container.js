angular.module('myApp')
    .component('menuContainer', {
        bindings: {
            map: '=',
            selectDimension: '&',
            footerShow: '&'
        },
        templateUrl: './components/menu-container/menu-container.html'
    })