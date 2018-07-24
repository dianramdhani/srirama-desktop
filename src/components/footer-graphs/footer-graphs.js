angular.module('myApp')
    .component('footerGraphs', {
        bindings: {
            footers: '='
        },
        controller: class footerGraphs {
            constructor($scope) {
                this.scope = $scope;
            }

            $onInit() {
                // style
                this.scope.footerGraphsStyle = {
                    height: '300px'
                }
            }
        },
        templateUrl: './components/footer-graphs/footer-graphs.html'
    })