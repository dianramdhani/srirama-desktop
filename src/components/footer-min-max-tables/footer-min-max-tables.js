angular.module('myApp')
    .component('footerMinMaxTables', {
        bindings: {
            map: '=',
            footers: '='
        },
        controller: class footerMinMaxTables {
            constructor($scope) {
                this.scope = $scope;
            }

            $onInit() {
                this.scope.footerMinMaxTablesStyle = {
                    height: '400px',
                    zIndex: 9999999
                }
            }
        },
        templateUrl: './components/footer-min-max-tables/footer-min-max-tables.html'
    })