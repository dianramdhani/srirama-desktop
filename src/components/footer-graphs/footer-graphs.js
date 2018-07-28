angular.module('myApp')
    .component('footerGraphs', {
        bindings: {
            footers: '=',
            lastPointMarkerAndId: '<',
            idGraphWillOpen: '<',
            updateMarker: '&',
            removeMarker: '&'
        },
        controller: class footerGraphs {
            constructor($scope, $timeout, api) {
                this.scope = $scope;
                this.timeout = $timeout;
                this.api = api;
            }

            $onInit() {
                this.scope.footerGraphsStyle = {
                    height: '400px',
                    zIndex: 9999999
                }

                this.graphs = [];

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
                        let id = Number(detail.tabEl.id.replace('tab-graph-', ''));
                        this.updateMarker({ id });
                        this.idTabActiveNow = id;
                    });

                    el.addEventListener('tabRemove', ({ detail }) => {
                        let id = Number(detail.tabEl.id.replace('tab-graph-', ''));
                        this.removeMarker({ id });
                    });
                });

                this.scope.saveThisGraph = () => {
                    angular.forEach(this.graphs, (graph) => {
                        if (graph.id === this.idTabActiveNow) {
                            let data = graph.dataPointTimeSeries,
                                dataCsv = '';
                            for (const key in data.coords) {
                                if (key !== data.dims[0]) {
                                    dataCsv = dataCsv + `"${key}",${data.coords[key].data}\n`;
                                }
                            }
                            dataCsv = dataCsv + `"${data.dims[0]}","${data.attrs.long_name} (${data.attrs.units})"\n`;
                            for (let i = 0; i < data.data.length; i++) {
                                dataCsv = dataCsv + `"${data.coords[data.dims[0]].data[i]}",${data.data[i]}\n`;
                            }
                            saveAs(new Blob([dataCsv], { type: 'text/csv;charset=utf-8;' }), "data.csv");
                        }
                    });
                };
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
                this.modalPilihWaktuShow = true;
                this.graphs.push({
                    id: this.lastPointMarkerAndId.id,
                    latlng: this.lastPointMarkerAndId.latlng
                });

                this.timeout(() => {
                    this.chromeTabs.addTab({
                        title: `${this.lastPointMarkerAndId.latlng.lat.toFixed(2)}, ${this.lastPointMarkerAndId.latlng.lng.toFixed(2)}`,
                        id: `tab-graph-${this.lastPointMarkerAndId.id}`
                    });
                });
            }

            openTab(id) {
                this.showContainer();
                if (document.getElementById(`tab-graph-${id}`)) {
                    document.getElementById(`tab-graph-${id}`).click();
                }
            }

            selectTime(selected) {
                angular.forEach(this.graphs, (graph) => {
                    if (graph.id === this.idTabActiveNow) {
                        this.modalLoadingShow = true;
                        this.api.getDataPointTimeSeries(selected, graph.latlng).then((res) => {
                            this.modalLoadingShow = false;
                            initGraph(`graph-${graph.id}`, res);
                            graph['dataPointTimeSeries'] = res;
                        });
                    }
                });

                function initGraph(divId, res) {
                    var selectedToTitle = ((selected) => {
                        var res = '', i = -1;
                        for (const key in selected) {
                            i++;
                            if (i === 0) {
                                res = res + `${key.toUpperCase()} 1: ${selected[key][0]}, ${key.toUpperCase()} 2: ${selected[key][1]}`
                            } else {
                                res = res + `, ${key.toUpperCase()}: ${selected[key]}`
                            }
                        }
                        return res;
                    })(selected);
                    var times = res.coords[res.dims[0]].data,
                        data = res.data,
                        title = `
                        ${res.attrs.long_name} (${res.attrs.units})
                        <br>
                        ${selectedToTitle}
                        `,
                        dataArr = [];
                    for (var i = 0; i < data.length; i++) {
                        dataArr.push([(new Date(times[i])).getTime(), data[i]]);    //.push(xArr, yArr)
                    }

                    var graph = Highcharts.stockChart(divId, {
                        rangeSelector: {
                            buttons: [{
                                type: 'year',
                                count: 1,
                                text: '1y'
                            }, {
                                type: 'year',
                                count: 10,
                                text: '10y'
                            }, {
                                type: 'year',
                                count: 30,
                                text: '30y'
                            }, {
                                type: 'all',
                                text: 'All'
                            }],
                            selected: 3
                        },
                        title: {
                            text: title
                        },
                        xAxis: {
                            type: 'datetime',
                            labels: {
                                formatter: function () {
                                    return Highcharts.dateFormat('%Y %b', this.value);
                                }
                            }
                        },
                        yAxis: {
                            opposite: false
                        },
                        tooltip: {
                            formatter: function () {
                                return Highcharts.dateFormat('%Y %b', new Date(this.x)) +
                                    `<br><b>${this.y}</b>`;
                            }
                        },
                        series: [{
                            data: dataArr
                        }]
                    });

                    window.addEventListener('resize', () => {
                        var width = document.getElementById(divId).clientWidth,
                            height = document.getElementById(divId).clientHeight;
                        graph.setSize(width, height);
                    }, true);
                }
            }
        },
        templateUrl: './components/footer-graphs/footer-graphs.html'
    })