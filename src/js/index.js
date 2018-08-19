angular.module('myApp', ['angular-electron'])
    .component('myTabs', {
        controller: ['$scope', class myTabs {
            constructor($scope) {
                this.scope = $scope;

                // variable view
                this.scope.datasetContentShow = true;
                this.scope.tabs = [];

                this.countId = -1;
                this.chromeTabs = new ChromeTabs();

                const el = document.querySelector('.chrome-tabs');
                this.chromeTabs.init(el, {
                    tabOverlapDistance: 14,
                    minWidth: 45,
                    maxWidth: 243
                });

                el.addEventListener('activeTabChange', (e) => {
                    // mekanisme hide dataset
                    if (!e.detail.tabEl.id)
                        this.scope.datasetContentShow = true;
                    else
                        this.scope.datasetContentShow = false;

                    // mekanisme tampil tab
                    if (e.detail.tabEl.id) {
                        var idTabNowShow = Number(e.detail.tabEl.id);
                        // console.log('ada yang mau di show', idTabNowShow);

                        // jika idTabLastShow gak null
                        // berarti sebelumnya ada yang di show
                        angular.forEach(this.scope.tabs, (tab) => {
                            tab.show = false;
                        })

                        angular.forEach(this.scope.tabs, (tab) => {
                            if (tab.id === idTabNowShow) {
                                tab.show = true;
                            }
                        });
                    }

                    scopeApply();
                });

                function scopeApply() {
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            }

            addTabs(tab) {
                this.countId++;
                tab.id = this.countId;
                this.scope.tabs.push(tab);

                this.chromeTabs.addTab({
                    title: tab.title,
                    id: tab.id
                });
            }
        }],
        template: `
                <div>
                    <div class="chrome-tabs">
                        <div class="chrome-tabs-content">
                            <div class="chrome-tab chrome-tab-current">
                                <div class="chrome-tab-background">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <symbol id="chrome-tab-geometry-left" viewBox="0 0 214 29">
                                                <path d="M14.3 0.1L214 0.1 214 29 0 29C0 29 12.2 2.6 13.2 1.1 14.3-0.4 14.3 0.1 14.3 0.1Z" />
                                            </symbol>
                                            <symbol id="chrome-tab-geometry-right" viewBox="0 0 214 29">
                                                <use xlink:href="#chrome-tab-geometry-left" />
                                            </symbol>
                                            <clipPath id="crop">
                                                <rect class="mask" width="100%" height="100%" x="0" />
                                            </clipPath>
                                        </defs>
                                        <svg width="50%" height="100%">
                                            <use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-background" />
                                            <use xlink:href="#chrome-tab-geometry-left" width="214" height="29" class="chrome-tab-shadow" />
                                        </svg>
                                        <g transform="scale(-1, 1)">
                                            <svg width="50%" height="100%" x="-100%" y="0">
                                                <use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-background" />
                                                <use xlink:href="#chrome-tab-geometry-right" width="214" height="29" class="chrome-tab-shadow" />
                                            </svg>
                                        </g>
                                    </svg>
                                </div>
                                <div class="chrome-tab-favicon"></div>
                                <div class="chrome-tab-title">Dataset</div>
                                <!--
                                    <div class="chrome-tab-close"></div>
                                -->
                            </div>
                        </div>
                        <div class="chrome-tabs-bottom-bar"></div>
                    </div>
                    <div id="contents">
                        <div ng-show="datasetContentShow" style="width: 100%; height: 100%;">
                            <!--  
                                <button ng-click="$ctrl.addTabs({title: 'baru', content: 'plot.html'})">tambah</button>
                                <br>
                            -->
                            <my-datasets add-tabs="$ctrl.addTabs(tab)"></my-datasets>
                        </div>
                        <div ng-repeat="tab in tabs track by $index" ng-show="(!datasetContentShow) && tab.show" style="width: 100%; height: 100%;">
                            <iframe ng-src="{{tab.content}}" frameborder="0" style="width: 100%; height: 100%;"></iframe>
                        </div>
                    </div>
                </div>
                `
    });

require('./api');
require('../components/my-datasets/my-datasets');