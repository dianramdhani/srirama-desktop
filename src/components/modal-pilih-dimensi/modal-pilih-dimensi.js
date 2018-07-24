angular.module('myApp')
    .component('modalPilihDimensi', {
        bindings: {
            modals: '=',
            selectDimension: '&'
        },
        controller: class modalPilihDimensi {
            constructor($scope, api) {
                this.scope = $scope;
                this.api = api;
            }

            $onInit() {
                this.scope.style = {
                    display: 'none',
                    zIndex: 99999999
                };

                this.api.getDimsWoLatLon().then((res) => {
                    this.scope.dims = res;
                    this.scope.select = {};

                    angular.forEach(this.scope.dims, ({ key, values }) => {
                        this.scope.select[key] = values[0];
                    });

                    this.scope.style.display = 'block';
                    console.log('dims tanpa lat dan lon', res);
                });
            }
        },
        templateUrl: './components/modal-pilih-dimensi/modal-pilih-dimensi.html'
    })