import FS from "fs";

/**
 * 读取证书信息
 * @returns {{key: *, cert: *}}
 */
export const configHttps = () => {
    const privateKey = FS.readFileSync('./config/cert/private.pem', 'utf8');
    const certificate = FS.readFileSync('./config/cert/cert.crt', 'utf8');
    return {key: privateKey, cert: certificate};
};