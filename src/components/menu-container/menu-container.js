angular.module('myApp')
    .component('menuContainer', {
        bindings: {
            footers: '=',
            footerShow: '&',
            modals: '=',
            modalShow: '&'
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

                this.scope.modalShow = (componentName) => {
                    this.modalShow({ componentName: componentName });
                    this.scope.listMenuShow = false;
                };
            }
        },
        templateUrl: './components/menu-container/menu-container.html'
    })