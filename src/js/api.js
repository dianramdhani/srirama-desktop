angular.module('myApp')
    .service('api', ['$http', '$q', class api {
        constructor($http, $q) {
            this.http = $http;
            this.q = $q;

            this.urlServer = 'http://localhost:4343';
            this.datasets = [];

            // console.log('berhasil membuat service api');
        }

        // digunakan di my-dataset
        setDataset(filePath) {
            // console.log('lokasi file', filePath);
            this.http({
                'url': 'http://localhost:4343/setdataset',
                'method': 'GET',
                'params': {
                    'filepath': filePath
                }
            }).then((res) => {
                res = res.data;
                // console.log(res);
                if (res.status)
                    this.datasets.push(res);
            });
        }

        closeDataset(idToClose) {
            angular.forEach(this.datasets, ({ id }, i) => {
                if (id === idToClose) {
                    this.datasets.splice(i, 1);
                    // console.log('tutup dataset id', id, i);
                }
            });
        }

        // digunakan di nav-map dan grafik-container
        getDimsWoLatLon() {
            const url = new URL(window.location.href);
            this.id = url.searchParams.get('id');
            this.key = url.searchParams.get('key');

            // console.log('id dan key', this.id, this.key);

            var q = this.q.defer();
            this.http({
                url: `${this.urlServer}/getdimswolatlon`,
                method: 'GET',
                params: {
                    id: this.id,
                    key: this.key
                }
            })
                .then((res) => {
                    /**
                     * var _contoh_response = [
                        {
                            'key': 'time',
                            'values': [202121, 2556506]
                        },
                        {
                            'key': 'lev',
                            'values': [201, 2016]
                        }
                    ];
                    */
                    res = res.data;
                    q.resolve(res);
                });
            return q.promise;
        }

        // digunakan di map-container
        getLayerHeader(selected) {
            var q = this.q.defer();
            // console.log('yang dipilih adalah', selected, this.id, this.key)

            this.http({
                url: `${this.urlServer}/getlayerheader`,
                method: 'GET',
                params: {
                    id: this.id,
                    key: this.key,
                    select: JSON.stringify(selected)
                }
            })
                .then((res) => {
                    /**
                     * res = {
                     * bounds: Array(2), 
                     * legends: Array(6), 
                     * long_name: <String>, 
                     * units: <String>
                     * }
                     */
                    res = res.data;
                    // console.log('hasil layer header', res);

                    this.layerHeader = res;
                    q.resolve(res);
                });
            return q.promise;
        }

        getDataPoint(selected, latlng) {
            var q = this.q.defer();

            this.http({
                'url': `${this.urlServer}/getdatapoint`,
                'method': 'GET',
                'params': {
                    'id': this.id,
                    'key': this.key,
                    'select': JSON.stringify(selected),
                    'lat': latlng.lat,
                    'lon': latlng.lng
                }
            })
                .then((res) => {
                    /**
                     * res = {
                     * attrs: Object, 
                     * coords: Object, 
                     * data: 73.3670425415039, 
                     * dims: Array(0), 
                     * name: "rhscrn"
                     * }
                     */
                    res = res.data;
                    res.attrs.units = res.attrs.units === 'none' ? ' ' : res.attrs.units;
                    q.resolve(res);

                    // console.log('data yang di click', res);
                });

            return q.promise;
        }

        getLayerHeaderCropped(selected, bounds) {
            var q = this.q.defer();
            this.http({
                'url': `${this.urlServer}/getlayerheadercropped`,
                'method': 'GET',
                'params': {
                    'id': this.id,
                    'key': this.key,
                    'select': JSON.stringify(selected),
                    'bounds': JSON.stringify(bounds),
                }
            })
                .then((res) => {
                    res = res.data;
                    this.layerHeader = res;
                    q.resolve(res);
                })
            return q.promise;
        }

        // digunakan di grafik-container
        getDataPointTimeSeries(selected, latlng) {
            // console.log('data time series yang di cari', selected, latlng);
            var q = this.q.defer();

            this.http({
                'url': `${this.urlServer}/getdatapointtimeseries`,
                'method': 'GET',
                'params': {
                    'id': this.id,
                    'key': this.key,
                    'select': JSON.stringify(selected),
                    'lat': latlng.lat,
                    'lon': latlng.lng
                }
            })
                .then((res) => {
                    res = res.data;
                    q.resolve(res);
                    // console.log('ini hasil response dari getdatapointtimeseries', res);
                });

            return q.promise;
        }

        // digunakan di footer-min-max-tables
        getDataPointMinOrMax(selected) {
            let q = this.q.defer(),
                _selected = Object.assign({}, selected);
            delete _selected.minOrMax;

            this.http({
                url: `${this.urlServer}/getdatapointminormax`,
                method: 'GET',
                params: {
                    id: this.id,
                    key: this.key,
                    minormax: selected.minOrMax,
                    select: JSON.stringify(_selected)
                }
            })
                .then((res) => {
                    res = res.data;
                    q.resolve(res);
                })
                .catch((res) => {
                    console.log(res);
                    q.reject(res);
                });

            return q.promise;
        }
    }])