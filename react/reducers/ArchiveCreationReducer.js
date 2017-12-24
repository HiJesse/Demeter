// archive creation reducer
import {ACTION_ARCHIVE_GET_ARCHIVE_FILE} from "../constants/ActionType";
import {isArrayEmpty} from "../../util/CheckerUtil";

const initialArchiveCreationState = {
    uploadDisabled: false, // 是否禁用上传文件
    archiveFile: null, // 要上传的文档文件信息
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
                uploadDisabled: !isArrayEmpty(action.data.file),
            });
            break;
        default:
    }
    return newState;
}