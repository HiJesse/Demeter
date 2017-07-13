const webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:3001',
        'webpack/hot/only-dev-server',
        './react/index.js'
    ],
    output: {
        path: __dirname + '/public/assets',
        publicPath: "/public/assets",
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            include: /\.js?$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        }, {
            test: /(\.css)$/,
            exclude: /node_module/,
            use: [
                'style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1
                    }
                }
            ]
        }, {
            test: /\.less$/,
            include: /node_modules/,
            use: [
                'style-loader',
                'css-loader',
                'less-loader'
            ],
        }]
    }, plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};