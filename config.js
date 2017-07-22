#!/usr/bin/env node

//  开发环境配置
const dev = {
    DATABASE: 'mongodb://localhost/demeter',
    JWT: {
        secret: 'demeter_jesse',
        whiteList: [
            '/',// 页面白名单
            '/login',
            '/modifyPassword',
            // 接口白名单
            '/api/v1/user/login',
            '/api/v1/user/modifyPassword'
        ]
    }
};

// 生产环境配置
const product = {
    DATABASE: 'mongodb://localhost/demeter',
    JWT: {
        secret: 'demeter_jesse',
        whiteList: [
            '/',// 页面白名单
            '/modifyPassword',
            // 接口白名单
            '/api/v1/login',
            '/api/v1/modifyPassword'
        ]
    }
};

export const env = dev;