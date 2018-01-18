#!/usr/bin/env node
require('isomorphic-fetch');

const argv = require('yargs').argv;
const fs = require("fs");
const formstream = require('formstream');
const https = require("https");
const API_UPLOAD = '/api/v1/archive/uploadArchiveByCLI';

const host = argv.host; // 接口host
const appId = argv.key; // app id
const archive = argv.archive; // 文档文件
const archiveDes = argv.archiveDes; // 文档描述

const isStringEmpty = val => val === undefined || val === null || val === '';

const exit = code => process.exit(code);

/**
 * 校验参数
 */
const checkParams = () => {
    if (isStringEmpty(host) ||
        isStringEmpty(appId) ||
        isStringEmpty(archive) ||
        isStringEmpty(archiveDes)) {
        console.log('参数不合法');
        printCLI();
        exit(-1);
    }

    fs.exists(archive.toString(), (exist) => {
        if (exist) {
            printParams();
            uploadArchive();
        } else {
            console.log('文档不存在');
            printCLI();
            exit(-1);
        }
    });
};

/**
 * 打印 cli 命令格式
 */
const printCLI = () => {
    console.log('--host 域名 eg. http://localhost:3000');
    console.log('--key AppID');
    console.log('--archive 文件');
    console.log('--archiveDes 文档描述');
};

/**
 * 打印参数
 */
const printParams = () => {
    console.log(`Host: ${host}`);
    console.log(`API: ${API_UPLOAD}`);
    console.log(`Key: ${appId}`);
    console.log(`Archive: ${archive}`);
    console.log(`ArchiveDes: ${archiveDes}`);
};

/**
 * 使用fetch 请求api 上传archive
 */
const uploadArchive = () => {
    console.log('开始上传');
    const form = formstream();
    const url = host + API_UPLOAD;

    form.field('appId', appId);
    form.file('archive', archive.toString(), archive.toString());
    form.field('archiveDes', archiveDes);

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const data = {
        method: 'POST',
        headers: form.headers(),
        body: form,
        agent
    };

    fetch(url, data).then(response => {
        if (!response.ok) {
            console.log(`${url} 请求失败 code = ${response.status}`);
            exit(-1);
        }
        parseUploadResult(response.json());
    }).catch((e) => {
        console.log(`${url} 请求失败 ${e}`);
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