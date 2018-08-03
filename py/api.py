import xarray
import numpy
from flask import Flask, request, jsonify, send_file, json
from flask_cors import CORS
import plot


class Datasets():
    __countDataset = -1
    __datasets = []

    def __datasetToRes(self, dataset):
        res = {}
        res['status'] = True
        res['keys'] = []
        for key in dataset.keys():
            temp = {}
            temp['key'] = key
            try:
                temp['long_name'] = str(dataset[key].long_name)
                temp['units'] = str(dataset[key].units)
            except AttributeError:
                temp['long_name'] = str(key)
                temp['units'] = ''
            temp['dims'] = dataset[key].dims
            res['keys'].append(temp)
        return res

    def __getLegend(self, datasel):
        res = {}
        res['legends'] = []
        res['units'] = datasel.units
        _max = datasel.max().data.tolist()
        _min = datasel.min().data.tolist()
        n = 6
        for i in range(0, n):
            legend = (((_max - _min) / (n - 1)) * i) + _min
            res['legends'].append(legend)
        return res

    def add(self, filePath):
        _temp = {}
        # proses pengujian dataset terlebih dahulu
        try:
            _temp['dataset'] = xarray.open_dataset(filePath)
        except IOError:
            return {'status': False}

        Datasets.__countDataset += 1
        _temp['id'] = Datasets.__countDataset

        Datasets.__datasets.append(_temp)
        res = self.__datasetToRes(dataset=_temp['dataset'])
        res['id'] = _temp['id']
        res['file'] = filePath.split('/')[-1]
        res['loc'] = filePath
        return res

    def close(self, id):
        for i in range(Datasets.__countDataset + 1):
            if Datasets.__datasets[i]['id'] == id:
                if Datasets.__datasets[i]['dataset']:
                    Datasets.__datasets[i]['dataset'].close()
                Datasets.__datasets[i]['dataset'] = None

    def getValsDimsWithoutLatLon(self, id, key):
        res = []
        for dataset in Datasets.__datasets:
            if dataset['id'] == id:
                _dataset = dataset['dataset'][key]
                _dimswolatlon = _dataset.dims[0:-2]
                for key in _dimswolatlon:
                    temp = {}
                    temp['key'] = key
                    if type(_dataset[key].data[0]) is numpy.datetime64:
                        temp['values'] = _dataset[key].data.astype(
                            str).tolist()
                    else:
                        temp['values'] = _dataset[key].data.tolist()
                    res.append(temp)
        return res

    def getLayerHeader(self, id, key, select):
        res = {}
        for dataset in Datasets.__datasets:
            if dataset['id'] == id:
                datasel = dataset['dataset'][key].sel(**select)
                lat = datasel[datasel.dims[-2]].data
                minlat = numpy.amin(lat).item()
                maxlat = numpy.amax(lat).item()
                lon = datasel[datasel.dims[-1]].data
                minlon = numpy.amin(lon).item()
                maxlon = numpy.amax(lon).item()
                res['bounds'] = [[minlat, minlon], [maxlat, maxlon]]
                res['long_name'] = datasel.long_name
                _legend = self.__getLegend(datasel)
                res['units'] = _legend['units']
                res['legends'] = _legend['legends']
        return res

    def getLayer(self, id, key, select, lat=None, lon=None):
        if lat == None and lon == None:
            for dataset in Datasets.__datasets:
                if dataset['id'] == id:
                    datasel = dataset['dataset'][key].sel(**select)
                    return datasel
        else:
            for dataset in Datasets.__datasets:
                if dataset['id'] == id:
                    datasel = dataset['dataset'][key]
                    # select lat
                    select[datasel.dims[-2]] = lat
                    # select lon
                    select[datasel.dims[-1]] = lon
                    select['method'] = 'nearest'
                    datasel = dataset['dataset'][key].sel(**select)
                    return datasel

    def getDataPointTimeSeries(self, id, key, select, lat, lon):
        for dataset in Datasets.__datasets:
            if dataset['id'] == id:
                datasel = dataset['dataset'][key]
                # select lat
                select[datasel.dims[-2]] = lat
                # select lon
                select[datasel.dims[-1]] = lon
                # update time
                select[datasel.dims[0]] = dataset['dataset'][datasel.dims[
                    0]].loc[select[datasel.dims[0]][0]:select[datasel.dims[0]][
                        1]]
                select['method'] = 'nearest'
                datasel = dataset['dataset'][key].sel(**select)
                return datasel

    def getDataPointMinOrMax(self, id, key, minormax, select):
        for dataset in Datasets.__datasets:
            if dataset['id'] == id:
                datasel = dataset['dataset'][key]
                select[datasel.dims[0]] = dataset['dataset'][datasel.dims[0]
                                                             ].loc[select[datasel.dims[0]][0]:select[datasel.dims[0]][1]]
                datasel = dataset['dataset'][key].sel(**select)
                if request.args.get('minormax') == 'min':
                    datasel = datasel.where(
                        datasel == datasel.min(), drop=True)
                elif request.args.get('minormax') == 'max':
                    datasel = datasel.where(
                        datasel == datasel.max(), drop=True)
                datasel[datasel.dims[0]].data = datasel[datasel.dims[0]
                                                        ].data.astype(str).tolist()
                return datasel

    def getLayerHeaderCropped(self, id, key, select, bounds):
        res = {}
        for dataset in Datasets.__datasets:
            if dataset['id'] == id:
                datasel = dataset['dataset'][key]

                lat1 = dataset['dataset'][datasel.dims[-2]
                                          ].sel(**{datasel.dims[-2]: bounds['lat'][0], 'method': 'nearest'})
                lat2 = dataset['dataset'][datasel.dims[-2]
                                          ].sel(**{datasel.dims[-2]: bounds['lat'][1], 'method': 'nearest'})
                lng1 = dataset['dataset'][datasel.dims[-1]
                                          ].sel(**{datasel.dims[-1]: bounds['lng'][0], 'method': 'nearest'})
                lng2 = dataset['dataset'][datasel.dims[-1]
                                          ].sel(**{datasel.dims[-1]: bounds['lng'][1], 'method': 'nearest'})
                select[datasel.dims[-2]
                       ] = dataset['dataset'][datasel.dims[-2]].loc[lat1: lat2]
                select[datasel.dims[-1]
                       ] = dataset['dataset'][datasel.dims[-1]].loc[lng1: lng2]

                datasel = dataset['dataset'][key].sel(**select)

                lat = datasel[datasel.dims[-2]].data
                minlat = numpy.amin(lat).item()
                maxlat = numpy.amax(lat).item()
                lon = datasel[datasel.dims[-1]].data
                minlon = numpy.amin(lon).item()
                maxlon = numpy.amax(lon).item()
                res['bounds'] = [[minlat, minlon], [maxlat, maxlon]]
                res['long_name'] = datasel.long_name
                _legend = self.__getLegend(datasel)
                res['units'] = _legend['units']
                res['legends'] = _legend['legends']
        return res

    def getLayerCropped(self, id, key, select, bounds):
        for dataset in Datasets.__datasets:
            if dataset['id'] == id:
                datasel = dataset['dataset'][key]

                lat1 = dataset['dataset'][datasel.dims[-2]
                                          ].sel(**{datasel.dims[-2]: bounds['lat'][0], 'method': 'nearest'})
                lat2 = dataset['dataset'][datasel.dims[-2]
                                          ].sel(**{datasel.dims[-2]: bounds['lat'][1], 'method': 'nearest'})
                lng1 = dataset['dataset'][datasel.dims[-1]
                                          ].sel(**{datasel.dims[-1]: bounds['lng'][0], 'method': 'nearest'})
                lng2 = dataset['dataset'][datasel.dims[-1]
                                          ].sel(**{datasel.dims[-1]: bounds['lng'][1], 'method': 'nearest'})
                select[datasel.dims[-2]
                       ] = dataset['dataset'][datasel.dims[-2]].loc[lat1: lat2]
                select[datasel.dims[-1]
                       ] = dataset['dataset'][datasel.dims[-1]].loc[lng1: lng2]

                datasel = dataset['dataset'][key].sel(**select)
                return datasel

    def getCount(self):
        return Datasets.__countDataset

    def getDatasets(self):
        return Datasets.__datasets


app = Flask(__name__)
CORS(app)


@app.route('/setdataset')
def setdataset():
    hasil = Datasets().add(filePath=request.args.get('filepath'))
    return jsonify(hasil)


@app.route('/getdimswolatlon')
def getdimswolatlon():
    id = int(request.args.get('id'))
    key = request.args.get('key')
    hasil = Datasets().getValsDimsWithoutLatLon(id=id, key=key)
    return jsonify(hasil)


@app.route('/getlayerheader')
def getlayerheader():
    id = int(request.args.get('id'))
    key = request.args.get('key')
    select = json.loads(request.args.get('select'))
    hasil = Datasets().getLayerHeader(id=id, key=key, select=select)
    return jsonify(hasil)


@app.route('/getlayer')
def getlayer():
    id = int(request.args.get('id'))
    key = request.args.get('key')
    select = json.loads(request.args.get('select'))
    hasil = plot.toPngResponse(Datasets().getLayer(
        id=id, key=key, select=select))
    return send_file(hasil, mimetype='image/png')


@app.route('/getdatapoint')
def getdatapoint():
    id = int(request.args.get('id'))
    key = request.args.get('key')
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    select = json.loads(request.args.get('select'))
    hasil = Datasets().getLayer(
        id=id, key=key, select=select, lat=lat, lon=lon).to_dict()
    return jsonify(hasil)


@app.route('/getdatapointtimeseries')
def getdatapointtimeseries():
    id = int(request.args.get('id'))
    key = request.args.get('key')
    lat = float(request.args.get('lat'))
    lon = float(request.args.get('lon'))
    select = json.loads(request.args.get('select'))
    hasil = Datasets().getDataPointTimeSeries(
        id=id, key=key, select=select, lat=lat, lon=lon).to_dict()
    return jsonify(hasil)


@app.route('/getdatapointminormax')
def getdatapointminormax():
    id = int(request.args.get('id'))
    key = request.args.get('key')
    minormax = request.args.get('minormax')
    select = json.loads(request.args.get('select'))
    hasil = Datasets().getDataPointMinOrMax(
        id=id, key=key, minormax=minormax, select=select).to_dict()
    return jsonify(hasil)


@app.route('/getlayerheadercropped')
def getlayerheadercropped():
    id = int(request.args.get('id'))
    key = request.args.get('key')
    select = json.loads(request.args.get('select'))
    bounds = json.loads(request.args.get('bounds'))
    hasil = Datasets().getLayerHeaderCropped(
        id=id, key=key, select=select, bounds=bounds)
    return jsonify(hasil)


@app.route('/getlayercropped')
def getlayercropped():
    id = int(request.args.get('id'))
    key = request.args.get('key')
    select = json.loads(request.args.get('select'))
    bounds = json.loads(request.args.get('bounds'))
    hasil = plot.toPngResponse(Datasets().getLayerCropped(
        id=id, key=key, select=select, bounds=bounds))
    return send_file(hasil, mimetype='image/png')


app.run(host='0.0.0.0', port=4343, debug=True)
