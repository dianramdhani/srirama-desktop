angular.module('myApp')
    .component('footerMinMaxTables', {
        bindings: {
            footers: '='
        },
        controller: class footerMinMaxTables {
            constructor($scope) {
                this.scope = $scope;
            }

            $onInit() {
                // style
                this.scope.footerMinMaxTablesStyle = {
                    height: '300px',
                    zIndex: 9999999
                }
            }
        },
        templateUrl: './components/footer-min-max-tables/footer-min-max-tables.html'
    })