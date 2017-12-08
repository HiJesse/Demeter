//project manager reducer
import {
    ACTION_CREATE_PROJECT_FULFILLED,
    ACTION_DELETE_PROJECT_FULFILLED,
    ACTION_DELETE_PROJECT_LOADING,
    ACTION_GET_LOGO_FILE,
    ACTION_SHOW_LOGO_PREVIEW,
    ACTION_UPDATE_PROJECT_DES,
    ACTION_UPDATE_PROJECT_INFO_FULFILLED,
    ACTION_UPDATE_PROJECT_LOADING,
    ACTION_UPLOAD_LOGO
} from "../constants/ActionType";
import {message} from "antd";
import {RES_SUCCEED} from "../../api/status/Status";
import {PROJECT_LOGO} from "../constants/FileConstant";

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
        ...state,
        previewVisible: visible,
        previewImage: image,
    }
};

/**
 * 创建项目
 * @param state
 * @param action
 * @returns {{}}
 */
const createProjectReducer = (state, action) => {
    if (action.status === RES_SUCCEED) {
        message.success('创建项目成功', 1.5, () => location.reload());
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
    };
};

/**
 * 更新项目信息
 * @param state
 * @param action
 * @returns {{confirmLoading: boolean}}
 */
const updateProjectReducer = (state, action) => {
    if (action.status === RES_SUCCEED) {
        message.success('更新项目成功');
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
        confirmLoading: false
    };
};

/**
 * 删除新项目
 * @param state
 * @param action
 * @returns {{confirmDeletingLoading: boolean}}
 */
const deleteProjectReducer = (state, action) => {
    if (action.status === RES_SUCCEED) {
        message.success('删除项目成功');
    } else {
        message.error(action.msg);
    }

    return {
        ...state,
        confirmDeletingLoading: false
    };
};

const initialProjectManagerState = {
    previewVisible: false,
    previewImage: '',
    logoFile: null,
    logo: PROJECT_LOGO,
    confirmLoading: -1,
    confirmDeletingLoading: -1,
    des: '',
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
                ...state,
                logo: action.data.file
            });
            break;
        case ACTION_GET_LOGO_FILE:
            newState = ({
                ...state,
                logoFile: action.data.file
            });
            break;
        case ACTION_CREATE_PROJECT_FULFILLED:
            newState = createProjectReducer(state, action.data);
            break;
        case ACTION_UPDATE_PROJECT_LOADING:
            newState = ({
                ...state,
                confirmLoading: action.data.confirmLoading
            });
            break;
        case ACTION_DELETE_PROJECT_LOADING:
            newState = ({
                ...state,
                confirmDeletingLoading: action.data.confirmDeletingLoading
            });
            break;
        case ACTION_UPDATE_PROJECT_DES:
            newState = ({
                ...state,
                des: action.data.des
            });
            break;
        case ACTION_UPDATE_PROJECT_INFO_FULFILLED:
            newState = updateProjectReducer(state, action.data);
            break;
        case ACTION_DELETE_PROJECT_FULFILLED:
            newState = deleteProjectReducer(state, action.data);
            break;
        default:
    }
    return newState;
}