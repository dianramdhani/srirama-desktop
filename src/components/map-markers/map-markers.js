angular.module('myApp')
    .component('mapMarkers', {
        bindings: {
            map: '=',
            lastMarkerAdded: '<'
        },
        controller: class mapMarkers {
            constructor($scope, $compile, api) {
                this.scope = $scope;
                this.compile = $compile;
                this.api = api;
            }

            $onInit() {
                console.log('mapMarkers terbuka');
            }

            $onChanges(e) {
                if (e.lastMarkerAdded) {
                    console.log('ada data baru di mapMarkers', this.lastMarkerAdded, this.map);
                }
            }
        },
        template: ''
    })