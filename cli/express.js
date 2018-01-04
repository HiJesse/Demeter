// express server
import app from "../config/ExpressConfig";
import * as Config from "../config/Config";
import {configHttps} from "../config/HttpsConfig";

/**
 * Module dependencies.
 */
const debug = require('debug')('demeter:server');
const https = require('https');

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(Config.env.SERVER_PORT || '3000');
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 * @param server
 */
const setupServer = (server) => {
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
};

/**
 * Create HTTP & HTTPS server.
 */
const httpsServer = https.createServer(configHttps(), app);

/**
 * 配置https信息
 */
setupServer(httpsServer);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = httpsServer.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
