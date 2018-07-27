angular.module('myApp')
    .component('mapMarkers', {
        bindings: {
            map: '=',
            dimSelected: '=',
            footers: '=',
            lastPointMarker: '<',
            dimSelectedToTemplatePopup: '&'
        },
        controller: class mapMarkers {
            constructor($scope, $compile, $q, api) {
                this.scope = $scope;
                this.compile = $compile;
                this.api = api;
                this.q = $q;
            }

            $onInit() {
                this.markers = [];
            }

            $onChanges(e) {
                if (e.lastPointMarker) {
                    if (e.lastPointMarker.currentValue) {
                        this.addMarker();
                    }
                }
            }

            addMarker() {
                let id = this.markers.length;
                this.dataPointToTemplateMarkerPopup(this.lastPointMarker, id)
                    .then(({ dataPoint, templateMarkerPopup }) => {
                        let marker = new L.marker(this.lastPointMarker).bindPopup(templateMarkerPopup).addTo(this.map.map).openPopup();
                        // untuk trigger onChanges
                        this.markers = angular.copy((() => { this.markers.push({ id, marker, dataPoint }); return this.markers; })());
                        console.log('markers', this.markers);

                        marker.on('click', () => {
                            this.updateMarker(id);
                        });
                    });
            }

            updateMarker(id) {
                angular.forEach(this.markers, (marker) => {
                    if (marker.id === id) {
                        this.dataPointToTemplateMarkerPopup(marker.marker._latlng, marker.id)
                            .then(({ dataPoint, templateMarkerPopup }) => {
                                marker.dataPoint = dataPoint;
                                marker.marker.bindPopup(templateMarkerPopup);
                            });
                    }
                });
            }

            dataPointToTemplateMarkerPopup(latlng, id) {
                var q = this.q.defer();

                this.api.getDataPoint(this.dimSelected, latlng)
                    .then((res) => {
                        let dataPoint = res,
                            popupTemplate = `
                        <div>
                            <h5>${dataPoint.attrs.long_name}</h5>
                            <p>
                                Latitude: ${latlng.lat}
                                <br>
                                Longitude: ${latlng.lng}
                                <br>
                                ${this.dimSelectedToTemplatePopup()}
                                <b>Data: ${dataPoint.data} ${dataPoint.attrs.units}</b>
                            </p>
                            <button class="w3-button w3-block w3-round w3-border" ng-click="openTab(${id})">Lihat grafik yang telah dibuka</button>
                        </div>
                        `;

                        q.resolve({
                            dataPoint,
                            templateMarkerPopup: this.compile(popupTemplate)(this.scope)[0]
                        });
                    });

                return q.promise;
            }
        },
        template: '<footer-graphs footers="$ctrl.footers" markers="$ctrl.markers"></footer-graphs>'
    })  