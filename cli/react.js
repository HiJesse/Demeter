// react server
import * as RootConfig from "../config";

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Config = require('../webpack.config');

new WebpackDevServer(webpack(Config), {
    publicPath: Config.output.publicPath,
    hot: true,
    noInfo: false,
    historyApiFallback: true
}).listen(RootConfig.env.REACT_PORT, RootConfig.env.REACT_IP, function (err, result) {
    if (err) {
        console.log(err);
    }
    console.log('Listening at localhost:3001 ' + result);
});