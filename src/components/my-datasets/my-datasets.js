angular.module('myApp')
    .component('myDatasets', {
        bindings: {
            addTabs: '&'
        },
        controller: ['$scope', 'app', 'Menu', 'dialog', 'api', class myDatasets {
            constructor($scope, app, Menu, dialog, api) {
                this.scope = $scope;

                this.scope.datasets = api.datasets;
                this.scope.closeDataset = api.closeDataset;
                this.scope.plot = (id, key) => {
                    this.addTabs({
                        tab: {
                            title: key.long_name,
                            content: `plot.html?id=${id}&key=${key.key}`
                        }
                    });
                    console.log('tab di tambah', id, key);
                }

                setupMenu();

                // kondisi awal langsung buka dialog open file nc
                dialogOpenFileNc();

                function setupMenu() {
                    const menuTemplate = [
                        {
                            label: 'File',
                            submenu: [
                                {
                                    label: 'Buka File NetCDF4',
                                    click() {
                                        // buka dialog
                                        dialogOpenFileNc();
                                    }
                                }
                            ]
                        },
                        // {
                        //     role: 'help',
                        //     submenu: [
                        //         {
                        //             label: 'Learn More',
                        //             click() { }
                        //         }
                        //     ]
                        // }
                    ];
                    app.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
                }

                function dialogOpenFileNc() {
                    const dialogConfig = {
                        title: 'Open File NetCDF4',
                        filters: [
                            { name: 'NetCDF4', extensions: ['nc'] }
                        ]
                    };
                    dialog.showOpenDialog(dialogConfig, (filePath) => {
                        if (filePath) {
                            console.log('berhasil membuka file', filePath);
                            api.setDataset(filePath);
                        }
                    });
                }
            }
        }],
        template: require('./my-datasets.html')
    })