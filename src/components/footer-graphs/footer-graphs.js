angular.module('myApp')
    .component('footerGraphs', {
        bindings: {
            footers: '=',
            lastPointMarkerAndId: '<',
            idGraphWillOpen: '<',
            updateMarker: '&'
        },
        controller: class footerGraphs {
            constructor($scope, $timeout) {
                this.scope = $scope;
                this.timeout = $timeout;
            }

            $onInit() {
                this.scope.footerGraphsStyle = {
                    height: '300px',
                    zIndex: 9999999
                }

                this.timeout(() => {
                    this.chromeTabs = new ChromeTabs();
                    const el = document.querySelector('.chrome-tabs');
                    this.chromeTabs.init(el, {
                        tabOverlapDistance: 14,
                        minWidth: 45,
                        maxWidth: 243
                    });

                    // remove tab default
                    this.chromeTabs.removeTab(el.querySelector('.chrome-tab-current'));

                    el.addEventListener('activeTabChange', ({ detail }) => {
                        let id = Number(detail.tabEl.id.replace('graph-', ''));
                        this.updateMarker({ id });
                    });
                });
            }

            $onChanges(e) {
                if (e.lastPointMarkerAndId) {
                    if (e.lastPointMarkerAndId.currentValue) {
                        this.showContainer();
                        this.addTab();
                    }
                }

                if (e.idGraphWillOpen) {
                    this.openTab(this.idGraphWillOpen);
                }
            }

            showContainer() {
                angular.forEach(this.footers, (footer) => {
                    if (footer.componentName === 'footer-graphs') {
                        footer.show = true;
                    } else {
                        footer.show = false;
                    }
                });
            }

            addTab() {
                this.timeout(() => {
                    this.chromeTabs.addTab({
                        title: `${this.lastPointMarkerAndId.latlng.lat.toFixed(2)}, ${this.lastPointMarkerAndId.latlng.lng.toFixed(2)}`,
                        id: `graph-${this.lastPointMarkerAndId.id}`
                    });
                });
            }

            openTab(id) {
                this.showContainer();
                if (document.getElementById(`graph-${id}`)) {
                    document.getElementById(`graph-${id}`).click();
                }
            }
        },
        templateUrl: './components/footer-graphs/footer-graphs.html'
    })