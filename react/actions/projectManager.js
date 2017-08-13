// project manager actions
import {ACTION_SHOW_LOGO_PREVIEW, ACTION_UPLOAD_LOGO} from "../constants/actionType";

/**
 * 是否显示logo预览弹窗
 * @param isShow
 * @param file 如果需要预览则填充file
 */
export const showLogoPreviewAction = (isShow, file) => ({
    type: ACTION_SHOW_LOGO_PREVIEW,
    data: {
        previewVisible: isShow,
        file: file
    }
});

/**
 * 上传logo action
 * @param file
 */
export const uploadLogoAction = file => ({
    type: ACTION_UPLOAD_LOGO,
    data: {
        file: file
    }
});