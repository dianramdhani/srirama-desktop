angular.module('myApp')
    .component('mapContainer', {
        controller: class mapContainer {
            constructor($filter) {
                this.filter = $filter;
            }

            $onInit() {
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
                    },
                    {
                        componentName: 'modal-loading',
                        title: '',
                        show: false
                    }
                ];
                this.modalsInMenu = this.filter('filter')(this.modals, ({ componentName }) => componentName === 'modal-pilih-dimensi' || componentName === 'modal-loading' || componentName === 'modal-pilih-waktu');
                this.modalShow = (componentName) => {
                    angular.forEach(this.modals, (modal) => {
                        if (modal.componentName === componentName) {
                            modal.show = true;
                        } else {
                            modal.show = false;
                        }
                    });
                };

                this.map = {
                    map: L.map('map').setView([0, 115], 4),
                    bounds: L.latLngBounds([0, 0], [0, 0]),
                };
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(this.map['map']);
                this.map['imageOverlay'] = L.imageOverlay('', this.map.bounds, { opacity: 0.5 });
                this.map.imageOverlay.addTo(this.map.map);
            }

            selectDimension(selected) {
                console.log('dimensi yang dipilih', selected);
            }
        },
        templateUrl: './components/map-container/map-container.html'
    })