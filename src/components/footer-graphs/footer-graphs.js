angular.module('myApp')
    .component('footerGraphs', {
        bindings: {
            footers: '=',
            markers: '<'
        },
        controller: class footerGraphs {
            constructor($scope) {
                this.scope = $scope;
            }

            $onInit() {
                this.scope.footerGraphsStyle = {
                    height: '300px',
                    zIndex: 9999999
                }
            }

            $onChanges(e){
                console.log('footerGraphs', e);
            }
        },
        templateUrl: './components/footer-graphs/footer-graphs.html'
    })