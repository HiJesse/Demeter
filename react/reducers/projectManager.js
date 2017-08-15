//project manager reducer
import {
    ACTION_CREATE_PROJECT,
    ACTION_GET_LOGO_FILE,
    ACTION_SHOW_LOGO_PREVIEW,
    ACTION_UPLOAD_LOGO
} from "../constants/actionType";
import * as Config from "../../config";

/**
 * 是否显示logo预览框, 如果要显示则填充preview image
 * @param state
 * @param action
 * @returns {{previewVisible: (boolean|*), previewImage: string}}
 */
const showLogoPreviewReducer = (state, action) => {
    const visible = action.previewVisible;
    let image = '';

    if (visible) {
        image = action.file.url || action.file.thumbUrl;
    }
    return {
        ... state,
        previewVisible: visible,
        previewImage: image,
    }
};

const initialProjectManagerState = {
    previewVisible: false,
    previewImage: '',
    logoFile: null,
    logo: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: Config.env.SERVER + ':' + Config.env.SERVER_PORT + '/image/project_logo.png',
    }],
};

/**
 * project manager模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function projectManager(state = initialProjectManagerState, action) {
    let newState = state;
    switch (action.type) {
        case ACTION_SHOW_LOGO_PREVIEW:
            newState = showLogoPreviewReducer(state, action.data);
            break;
        case ACTION_UPLOAD_LOGO:
            newState = ({
                ... state,
                logo: action.data.file
            });
            break;
        case ACTION_GET_LOGO_FILE:
            newState = ({
                ... state,
                logoFile: action.data.file
            });
            break;
        case ACTION_CREATE_PROJECT:
            console.log('jesse', action.data);
            break;
        default:
    }
    return newState;
}