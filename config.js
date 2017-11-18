// config

//  开发环境配置
const dev = {
    DATABASE: 'mongodb://localhost/demeter',
    SERVER: 'http://localhost',
    SERVER_PORT: 3000,
    PUBLIC_PATH: 'public',
    REACT_IP: '127.0.0.1',
    REACT_PORT: 3001,
    JWT: {
        secret: 'demeter_jesse',
        whiteList: [
            // 页面白名单
            '/',
            '/login',
            '/modifyPassword',
            // 资源白名单
            /^\/upload\/project_logo\/.*/,
            /^\/image\/.*/,
            /^\/assets\/.*/,
            // 接口白名单
            '/api/v1/user/login',
            '/api/v1/user/modifyPassword',
            '/api/v1/archive/uploadArchive'
        ]
    }
};

// 生产环境配置
const product = {
    DATABASE: 'mongodb://localhost/demeter',
    SERVER: 'http://localhost',
    SERVER_PORT: 3000,
    PUBLIC_PATH: 'public',
    REACT_IP: '127.0.0.1',
    REACT_PORT: 3001,
    JWT: {
        secret: 'demeter_jesse',
        whiteList: [
            // 页面白名单
            '/',
            '/login',
            '/modifyPassword',
            // 资源白名单
            /^\/upload\/project_logo\/.*/,
            /^\/image\/.*/,
            /^\/assets\/.*/,
            // 接口白名单
            '/api/v1/user/login',
            '/api/v1/user/modifyPassword'
        ]
    }
};

export const env = dev;