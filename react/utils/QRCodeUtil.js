// qr code util
import QRCode from "qrcode";

const TAG = 'QRCodeUtil';

/**
 * 根据内容构建二维码地址
 * @param content
 */
export const buildQRCode = content => new Promise((resolve, reject) => {
    QRCode.toDataURL(content, function (err, url) {
        if (err) {
            reject({buildQRCodeError: true});
        }
        resolve({qrCodeUrl: url});
    })
});