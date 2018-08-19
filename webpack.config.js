const path = require('path');

const index = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'src/dist'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    'html-loader'
                ]
            }
        ]
    }
};

const plot = {
    entry: './src/js/plot.js',
    output: {
        path: path.resolve(__dirname, 'src/dist'),
        filename: 'plot.js',
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    'html-loader'
                ]
            }
        ]
    }
};

module.exports = [index, plot];