#!/usr/bin/env node
require('isomorphic-fetch');

const argv = require('yargs').argv;
const fs = require("fs");

const api = argv.api; // 接口api
const appId = argv.key; // app id
const archive = argv.archive; // 文档文件
const archiveDes = argv.archiveDes; // 文档描述

const isStringEmpty = val => val === undefined || val === null || val === '';

const exit = code => process.exit(code);

/**
 * 校验参数
 */
const checkParams = () => {
    if (isStringEmpty(api) ||
        isStringEmpty(appId) ||
        isStringEmpty(archive)) {
        console.log('参数不合法');
        exit(-1);
    }

    fs.exists(archive.toString(), (exist) => {
        if (exist) {
            printParams();
            uploadArchive();
        } else {
            console.log('文档不存在');
            exit(-1);
        }
    });
};

/**
 * 打印参数
 */
const printParams = () => {
    console.log(`API: ${api}`);
    console.log(`Key: ${appId}`);
    console.log(`Archive: ${archive}`);
    console.log(`ArchiveDes: ${archiveDes}`);
};

/**
 * 使用fetch 请求api 上传archive
 */
const uploadArchive = () => {
    console.log('开始上传');
    const formData = {
        appId: appId,
    };


    if (!isStringEmpty(archiveDes)) {
        formData.archiveDes = archiveDes;
    }

    const data = {
        method: 'POST',
        body: formData
    };

    fetch(api, data).then(response => {
        if (!response.ok) {
            console.log(`${api} 请求失败 code = ${response.status}`);
            exit(-1);
        }
        parseUploadResult(response.json());
    }).catch((e) => {
        console.log(`${api} 请求失败`);
        console.log(e);
        exit(-1);
    });
};

/**
 * 解析接口返回结果
 * @param jsonPromise
 */
const parseUploadResult = (jsonPromise) => {
    jsonPromise.then((json) => {
        console.log(json);
        if (json.status === 0) {
            console.log('上传成功');
        } else {
            console.log('上传失败');
            exit(-1);
        }

    }).catch(() => {
        console.log('json解析失败');
        exit(-1);
    });
};

checkParams();