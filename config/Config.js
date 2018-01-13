// config

// jwt配置
const JWT = {
    secret: 'demeter_jesse',
    whiteList: [
        // 页面白名单
        '/',
        '/login',
        '/modifyPassword',
        // 资源白名单
        /^\/upload\/project_logo\/.*/,
        /^\/upload\/project_archive\/.*/,
        /^\/image\/.*/,
        /^\/assets\/.*/,
        // 接口白名单
        '/upload',
        '/api/v1/user/login',
        '/api/v1/user/modifyPassword',
        '/api/v1/archive/uploadArchiveByCLI'
    ]
};

// 又拍云配置
const UPYUN = {
    bucket: "xxx",
    operator: "xxx",
    password: "xxx"
};

//  开发环境配置
const dev = {
    DB: 'mysql://root:mysql@127.0.0.1/demeter_test',
    SERVER: 'https://localhost',
    SERVER_PORT: 3000,
    PUBLIC_PATH: 'public',
    LOG_LEVEL: 'debug',
    JWT: JWT,
    UPYUN: UPYUN,
};

// 生产环境配置
const product = {
    DB: 'mysql://root:mysql@127.0.0.1/demeter',
    SERVER: 'https://localhost',
    SERVER_PORT: 9000,
    PUBLIC_PATH: 'public',
    LOG_LEVEL: 'info',
    JWT: JWT,
    UPYUN: UPYUN,
};

export const env = product;

/**
 * 日志配置
 */
export const CONFIG_LOG = {
    appenders: {
        ruleConsole: {type: 'console'},
        ruleFile: {
            type: 'dateFile',
            filename: 'logs/server-',
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 10 * 1000 * 1000,
            numBackups: 3,
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {appenders: ['ruleConsole', 'ruleFile'], level: 'info'}
    }
};