angular.module('myApp')
    .component('footerMinMaxTables', {
        bindings: {
            map: '=',
            footers: '=',
            modalCariNilaiMinMaxShow: '='
        },
        controller: class footerMinMaxTables {
            constructor($scope, $timeout, api) {
                this.scope = $scope;
                this.timeout = $timeout;
                this.api = api;
            }

            $onInit() {
                this.scope.footerMinMaxTablesStyle = {
                    height: '400px',
                    zIndex: 9999999
                };

                this.tables = [];
                this.scope.countTab = 0;

                this.timeout(() => {
                    this.chromeTabs = new ChromeTabs();
                    const el = document.getElementById('tabs-min-max-tables');
                    this.chromeTabs.init(el, {
                        tabOverlapDistance: 14,
                        minWidth: 45,
                        maxWidth: 243
                    });

                    // remove tab default
                    this.chromeTabs.removeTab(el.querySelector('.chrome-tab-current'));

                    el.addEventListener('activeTabChange', ({ detail }) => {
                        let id = Number(detail.tabEl.id.replace('tab-min-max-table-', ''));
                        this.scope.idTabActiveNow = id;
                        this.scope.$apply();

                        console.log('footerMinMaxTables activeTabChange', this.scope.idTabActiveNow);
                    });

                    el.addEventListener('tabRemove', ({ detail }) => {
                        this.scope.countTab--;
                        this.scope.$apply();
                    });
                });
            }

            selectMinMax(selected) {
                console.log('footerMinMaxTables', selected);
                this.showContainer();
                this.addTab(selected);
            }

            showContainer() {
                angular.forEach(this.footers, (footer) => {
                    if (footer.componentName === 'footer-min-max-tables') {
                        footer.show = true;
                    } else {
                        footer.show = false;
                    }
                });
            }

            addTab(selected) {
                this.tables.push({ id: this.tables.length });

                let title = `${JSON.stringify(selected)}`;
                this.timeout(() => {
                    this.chromeTabs.addTab({
                        title,
                        id: `tab-min-max-table-${this.tables.length - 1}`
                    });
                });

                this.scope.countTab++;
            }
        },
        templateUrl: './components/footer-min-max-tables/footer-min-max-tables.html'
    })