angular.module('myApp')
    .component('modalLoading', {
        bindings: {
            modalLoadingShow: '='
        },
        templateUrl: './components/modal-loading/modal-loading.html'
    })