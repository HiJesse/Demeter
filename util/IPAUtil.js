// ipa file parser
import PList from "plist";
import AdmZip from "adm-zip";
import BPList from "bplist-parser";
import * as FileUtil from "./FileUtil";
import * as LogUtil from "./LogUtil";
import * as CheckerUtil from "./CheckerUtil";
import {isObjectEmpty} from "./CheckerUtil";

const TAG = 'IPAUtil';

/**
 * 解析IPA文件
 * @param filePath ipa文件路径
 * @param outputFilePath 解析出OTA用plist文件路径
 * @param downloadUrl ipa https下载地址
 * @param cb
 */
export const parseIPA = (filePath, outputFilePath, downloadUrl, cb) => {
    const ipa = new AdmZip(filePath);
    let failed = true;

    if (isObjectEmpty(ipa)) {
        cb(new Error(`${TAG} parseIPA invalid ${filePath}`));
        return;
    }

    const ipaEntries = ipa.getEntries(); // an array of ZipEntry records

    if (isObjectEmpty(ipa)) {
        cb(new Error(`${TAG} parseIPA invalid entries`));
        return;
    }

    // 遍历ipa包内entry
    ipaEntries.forEach(ipaEntry => {
        if (CheckerUtil.isStringContains(ipaEntry.entryName, 'Info.plist') &&
            CheckerUtil.getStringMatchNum(ipaEntry.entryName, '/') === 2) {
            parseBinaryPList(ipa.readFile(ipaEntry.entryName), (err, data) => {

                if (err) {
                    cb(err);
                    return;
                }

                data.OTAUrl = downloadUrl;

                buildPList(data, outputFilePath, () => {
                    failed = false;
                    cb(null);
                });
            });
        }
    });

    if (failed) {
        cb(new Error(`${TAG} parseIPA invalid Info.plist`));
    }
};

/**
 * 解析plist文件
 * @param filePath
 * @param cb
 */
export const parsePList = (filePath, cb) => {
    let fileContent, result;

    try {
        fileContent = FileUtil.read(filePath);
        result = PList.parse(fileContent);
    } catch (err) {
        LogUtil.e(`${TAG} parsePList ${JSON.stringify(err)}`);
        cb(err);
        return;
    }

    cb(null, result);
};

/**
 * 解析二进制plist内容
 * @param filePath 文件路径 或者文件buffer
 * @param cb
 */
export const parseBinaryPList = (filePath, cb) => {
    BPList.parseFile(filePath, (err, data) => {
        if (err) {
            LogUtil.e(`${TAG} parseBinaryPList ${JSON.stringify(err)}`);
            cb(err);
            return;
        }

        if (CheckerUtil.isArrayEmpty(data)) {
            LogUtil.e(`${TAG} parseBinaryPList invalid array`);
            cb(new Error('invalid array'));
            return;
        }
        cb(null, data[0]);
    });
};

/**
 * 构建plist文件
 * @param content obj
 * @param filePath
 * @param cb
 */
export const buildPList = (content, filePath, cb) => {
    let plistContent;
    const plistJson = {
        items: [{
            assets: [{
                kind: "software-package",
                url: content.OTAUrl || '',
            }],
            metadata: {
                "bundle-identifier": content.CFBundleIdentifier || 'example',
                "bundle-version": content.CFBundleShortVersionString || '1.0.0',
                kind: "software",
                title: content.CFBundleDisplayName || '未知'
            }
        }]
    };

    try {
        plistContent = PList.build(plistJson);
        FileUtil.touch(filePath, plistContent);
    } catch (err) {
        LogUtil.e(`${TAG} buildPList ${JSON.stringify(err)}`);
        cb(err);
        return;
    }
    cb(null);
};