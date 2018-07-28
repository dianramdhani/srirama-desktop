angular.module('myApp')
    .component('mapContainer', {
        controller: class mapContainer {
            constructor($scope, $filter, api) {
                this.scope = $scope;
                this.filter = $filter;
                this.api = api;
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

                this.map = {
                    map: L.map('map', { attributionControl: false }).setView([0, 115], 4),
                    bounds: L.latLngBounds([0, 0], [0, 0]),
                };
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map['map']);
                this.map['imageOverlay'] = L.imageOverlay('', this.map.bounds, { opacity: 0.5 });
                this.map.imageOverlay.addTo(this.map.map);
            }

            selectDimension(selected) {
                this.api.getLayerHeader(selected).then((res) => {
                    this.map.map.closePopup();
                    this.map.bounds = L.latLngBounds(res.bounds);
                    this.map.imageOverlay.setBounds(this.map.bounds);
                    this.map.imageOverlay.setUrl(`${this.api.urlServer}/getlayer?id=${this.api.id}&key=${this.api.key}&select=${JSON.stringify(selected)}`);

                    this.legend = {
                        legendText: res.legends,
                        unit: res.units
                    };
                    this.scope.title = res.long_name;
                });

                // dimensi yang dipilih
                this.dimSelected = selected;
            }

            selectLocation(latlng) {
                this.map.map.fireEvent('click', { latlng });
            }
        },
        templateUrl: './components/map-container/map-container.html'
    })