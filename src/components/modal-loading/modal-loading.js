angular.module('myApp')
    .component('modalLoading', {
        bindings: {
            modalLoadingShow: '='
        },
        template: require('./modal-loading.html')
    })