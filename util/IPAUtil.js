// ipa file parser
import PList from "plist";
import * as FileUtil from "./FileUtil";
import * as LogUtil from "./LogUtil";


/**
 * 解析IPA文件
 * @param filePath
 */
export const parseIPA = filePath => {

};

/**
 * 解析plist文件
 * @param filePath
 */
export const parsePList = filePath => {
    const fileContent = FileUtil.read(filePath);
    const obj = PList.parse(fileContent);
    LogUtil.e(fileContent);
    LogUtil.e(obj);
};

/**
 * 构建plist文件
 * @param content
 * @param filePath
 */
export const buildPList = (content, filePath) => {

    const plistJson = {
        items: [{
            assets: [{
                kind: "software-package",
                url: "https://10.202.0.47:9000/upload/project_archive/1515141944464-4.0.0.ipa"
            }],
            metadata: {
                "bundle-identifier": "com.company.app",
                "bundle-version": "0.1.1",
                "kind": "software",
                "title": "AppName"
            }
        }]
    }

    const plistContent = PList.build(plistJson);
    LogUtil.e(plistContent);
    FileUtil.touch(filePath, plistContent);
};