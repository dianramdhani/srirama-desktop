angular.module('myApp')
    .component('mapContainer', {
        controller: class mapContainer {
            constructor($scope, $filter) {
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

                this.modals = [
                    {
                        componentName: 'modal-pilih-dimensi',
                        title: 'Pilih Dimensi',
                        show: true
                    },
                    {
                        componentName: 'modal-pilih-waktu',
                        title: 'Pilih Waktu',
                        show: false
                    }
                ];
                // pilih waktu ditampilkan di komponen footer-graphs
                this.modalsInMenu = $filter('filter')(this.modals, ({ componentName }) => componentName !== 'modal-pilih-waktu');
                this.modalShow = (componentName) => {
                    angular.forEach(this.modals, (modal) => {
                        if (modal.componentName === componentName) {
                            modal.show = true;
                        } else {
                            modal.show = false;
                        }
                    });
                };
            }

            $onInit() {
            }
        },
        templateUrl: './components/map-container/map-container.html'
    })