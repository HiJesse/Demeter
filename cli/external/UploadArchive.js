#!/usr/bin/env node
const argv = require('yargs').argv;
const fs = require("fs");

const api = argv.api; // 接口api
const appId = argv.key; // app id
const archive = argv.archive; // 文档文件
const archiveDes = argv.archiveDes; // 文档描述

const isStringEmpty = (val) => val === undefined || val === null || val === '';

/**
 * 校验参数
 */
const checkParams = () => {
    if (isStringEmpty(api) ||
        isStringEmpty(appId) ||
        isStringEmpty(archive)) {
        console.log('参数不合法');
        process.exit(-1);
    }

    fs.exists(archive.toString(), (exist) => {
        if (!exist) {
            console.log('文档不存在');
            process.exit(-1);
        }
    });
};

checkParams();