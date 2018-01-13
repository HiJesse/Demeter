// up yun util
import UpYun from "upyun";
import * as Config from "../config/Config";
import * as FileUtil from "./FileUtil";

const __instance = (function () {
    let instance;
    return (newInstance) => {
        if (newInstance) {
            instance = newInstance;
        }
        return instance;
    }
}());


export default class UpYunUtil {

    // 又拍云实例
    client;

    constructor() {
        if (__instance()) {
            return __instance();
        }

        this._initClient();
        __instance(this);
    }

    /**
     * 初始化又拍云client
     * @private
     */
    _initClient() {
        const service = new UpYun.Service(Config.env.UPYUN.bucket, Config.env.UPYUN.operator, Config.env.UPYUN.password);
        this.client = new UpYun.Client(service);
    }

    /**
     * 创建目录
     * @param remotePath
     * @returns {*}
     */
    mkdir(remotePath) {
        return this.client.makeDir(remotePath);
    }

    /**
     * 向又拍云控件上传文件
     * @param remotePath
     * @param localFile
     * @returns {*}
     */
    upload(remotePath, localFile) {
        return this.client.putFile(remotePath, FileUtil.getReadStream(localFile));
    }
}