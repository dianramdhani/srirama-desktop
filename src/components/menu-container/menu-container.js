angular.module('myApp')
    .component('menuContainer', {
        bindings: {
            footers: '=',
            footerShow: '&'
        },
        controller: class menuContainer {
            constructor($scope) {
                this.scope = $scope;
            }

            $onInit() {
                this.scope.footerShow = (componentName) => {
                    this.footerShow({ componentName: componentName });
                    this.scope.listMenuShow = false;
                };
            }
        },
        templateUrl: './components/menu-container/menu-container.html'
    })