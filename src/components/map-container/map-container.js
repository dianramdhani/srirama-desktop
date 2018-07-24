angular.module('myApp')
    .component('mapContainer', {
        controller: class mapContainer {
            constructor($scope) {
                this.scope = $scope;
                this.footers = [
                    {
                        componentName: 'footer-graphs',
                        title: 'Grafik',
                        show: false
                    },
                    {
                        componentName: 'footer-min-max-tables',
                        title: 'Tabel Min dan Max',
                        show: false
                    }
                ];
                this.footerShow = (componentName) => {
                    angular.forEach(this.footers, (footer) => {
                        if (footer.componentName === componentName) {
                            footer.show = true;
                        } else {
                            footer.show = false;
                        }
                    });
                };
            }

            $onInit() {
            }
        },
        templateUrl: './components/map-container/map-container.html'
    })