angular.module('myApp')
    .component('modalPilihWaktu', {
        bindings: {
            modals: '='
        },
        controller: class modalPilihWaktu {
            constructor($scope) {
                this.scope = $scope;
            }

            $onInit() {
            }
        },
        templateUrl: './components/modal-pilih-waktu/modal-pilih-waktu.html'
    })