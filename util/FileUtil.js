// file utils
import FS from "fs";
import Path from "path";
import Util from "util";
import Wrench from "wrench";

export const PERMISSION_CODE = {
    ALL: '0777',
};

/**
 * 是否为文件
 * @param src 文件路径
 */
export const isFile = src => isExist(src) && FS.statSync(src).isFile();

/**
 * 是否为目录
 * @param src 目录路径
 */
export const isDirectory = src => isExist(src) && FS.statSync(src).isDirectory();

/**
 * 文件是否存在
 * @param src 文件路径
 */
export const isExist = src => FS.existsSync(src);

/**
 * 获取文件扩展名
 */
export const getSuffix = (src, withDot) => {
    const suffix = Path.extname(src);
    if (suffix && !withDot && suffix.charAt(0) === '.') {
        return suffix.substr(1);
    }
    return suffix;
};

/**
 * 创建文件夹
 * @param src 单个或数组文件夹
 * @param permission 文件夹权限 0777 | 0755 | ...
 */
export const mkdir = (src, permission) => {
    if (Util.isArray(src)) {
        src.forEach(item => {
            mkdir(item, permission);
        })
    } else if (!isExist(src)) {
        Wrench.mkdirSyncRecursive(src, permission || PERMISSION_CODE.ALL);
    }
};

/**
 * 创建文件或文件数组
 * @param src 单个或数据文件
 * @param data 文件写入数据
 * @param permission 文件夹权限
 */
export const touch = (src, data, permission) => {
    const defaultPermission = permission || PERMISSION_CODE.ALL;
    if (Util.isArray(src)) {
        src.forEach(item => {
            touch(item, defaultPermission);
        })
    } else {
        data = data || '';
        mkdir(Path.dirname(src), defaultPermission);
        write(src, data);
    }
};

/**
 * 删除文件或文件组数
 * @param src 单个或数组文件路径
 */
export const deleteFile = src => {
    if (Util.isArray(src)) {
        src.forEach(item => {
            deleteFile(item);
        });
        return;
    }

    if (!isExist(src)) {
        return;
    }

    if (isDirectory(src)) {
        Wrench.rmdirSyncRecursive(src, true);
    } else {
        FS.unlinkSync(src);
    }
};

/**
 * 向文件中写入数据
 * @param src 文件路径
 * @param data 数据
 * @param encoding 编码 默认utf-8
 */
export const write = (src, data, encoding) => FS.writeFileSync(src, data, encoding || 'utf-8');

/**
 * 读取文件内容
 * @param src 文件路径
 * @param encoding 编码方式 默认 utf-8
 */
export const read = (src, encoding) => FS.readFileSync(src, encoding || 'utf-8');

/**
 * 获取文件流
 * @param src
 */
export const getReadStream = src => FS.createReadStream(src);

/**
 * 文件中追加内容
 * @param src 文件路径
 * @param data 追加内让
 * @param encoding 编码方式 默认 utf-8
 */
export const append = (src, data, encoding) => FS.appendFileSync(src, data, encoding || 'utf-8');
