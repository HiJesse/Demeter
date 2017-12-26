// archive creation reducer
import {message} from "antd";
import {
    ACTION_ARCHIVE_GET_ARCHIVE_FILE,
    ACTION_ARCHIVE_UPLOAD,
    ACTION_ARCHIVE_UPLOAD_FULFILLED
} from "../constants/ActionType";
import {isArrayEmpty, isObjectEmpty} from "../../util/CheckerUtil";
import {RES_SUCCEED} from "../../api/status/Status";

const initialArchiveCreationState = {
    uploadDisabled: false, // 是否禁用上传文件
    archiveFile: null, // 要上传的文档文件信息
};

/**
 * 上传文档参数校验
 * @param state
 * @param data
 */
const uploadArchiveCheckerReducer = (state, data) => {
    if (isObjectEmpty(data.archive)) {
        message.error('请先上传文档');
        return;
    }

    if (isObjectEmpty(data.projectId)) {
        message.error('请选择项目');
        return;
    }

    if (isObjectEmpty(data.platformId)) {
        message.error('请选择平台');
    }
};

/**
 * 上传文档reducer reducer
 * @param state
 * @param action
 */
const uploadArchiveReducer = (state, action) => {
    if (action.status === RES_SUCCEED) {
        message.success('创建文档成功', 1.5, () => location.reload());
    } else {
        message.error(action.msg);
    }
};

/**
 * archive creation 模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function archiveCreation(state = initialArchiveCreationState, action) {
    let newState = state;

    switch (action.type) {
        case ACTION_ARCHIVE_GET_ARCHIVE_FILE:
            newState = ({
                ...state,
                archiveFile: action.data.file,
                uploadDisabled: !isArrayEmpty(action.data.file), // 限制只能上传一个文件
            });
            break;
        case ACTION_ARCHIVE_UPLOAD:
            uploadArchiveCheckerReducer(state, action.data);
            break;
        case ACTION_ARCHIVE_UPLOAD_FULFILLED:
            uploadArchiveReducer(state, action.data);
            break;
        default:
    }
    return newState;
}