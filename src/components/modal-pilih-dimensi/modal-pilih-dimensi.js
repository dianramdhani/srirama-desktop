angular.module('myApp')
    .component('modalPilihDimensi', {
        bindings: {
            modals: '='
        },
        controller: class modalPilihDimensi {
            constructor($scope) {
                this.scope = $scope;
            }

            $onInit() {
            }
        },
        templateUrl: './components/modal-pilih-dimensi/modal-pilih-dimensi.html'
    })