// archive manager
import {
    ACTION_ARCHIVE_BUILD_DOWNLOAD_QR_CODE_FULFILLED,
    ACTION_ARCHIVE_DELETE_ARCHIVE_FULFILLED,
    ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED,
    ACTION_ARCHIVE_FETCH_ARCHIVES_FULFILLED,
    ACTION_ARCHIVE_SELECT_ARCHIVE_DES,
    ACTION_ARCHIVE_SELECT_PLATFORM,
    ACTION_ARCHIVE_SELECT_PROJECT,
    ACTION_ARCHIVE_SET_DOWNLOAD_INFO,
    ACTION_DOWNLOAD_ARCHIVE_DIALOG_VISIBLE
} from "../constants/ActionType";
import {RES_SUCCEED} from "../../api/status/Status";
import {message} from "antd";
import {bytesToSize} from "../../util/CalculateUtil";
import {formatDate} from "../../util/TimeUtil";
import {isStringEmpty} from "../../util/CheckerUtil";

/**
 * 获取可访问项目列表 reducer
 * @param state
 * @param action
 */
const fetchAllProjectsReducer = (state, action) => {
    const succeed = action.status === RES_SUCCEED;
    if (!succeed) {
        message.error(action.msg);
        return {
            ...state,
            projectList: [],
            needRefreshData: false
        };
    }

    const projectList = action.data.projectList.map((item, index) => ({
        key: index,
        value: String(item.id),
        name: item.projectName
    }));

    return {
        ...state,
        projectList: projectList,
        needRefreshData: false
    };
};

/**
 * 获取文档列表 reducer
 * @param state
 * @param action
 */
const fetchAllArchivesReducer = (state, action) => {
    const succeed = action.status === RES_SUCCEED;
    if (!succeed) {
        message.error(action.msg);
        return {
            ...state,
            archiveList: [],
            pageLoading: false,
            needRefreshData: false
        };
    }

    const archiveList = action.data.archiveList.map(function (item, index) {
        return {
            key: index,
            project: {
                projectId: item.projectId,
                projectName: item.projectName,
                projectLogo: item.avatar,
            },
            archiveId: item.id,
            platform: item.platformId,
            archiveName: item.archiveName,
            archiveDes: item.des,
            archiveSize: bytesToSize(item.archiveSize),
            archiveCreatedAt: formatDate(item.createdAt),
            archivePath: item.archivePath,
            archiveExtraData: item.extraData,
        };
    });

    return {
        ...state,
        archiveList: archiveList,
        archiveCount: action.data.archiveCount,
        pageNum: action.data.pageNum,
        pageLoading: false,
        needRefreshData: false
    };
};

/**
 * 删除文档, 成功的话则刷新table数据
 * @param state
 * @param action
 * @returns {*}
 */
function deleteArchiveReducer(state, action) {
    const succeed = action.status === RES_SUCCEED;
    if (!succeed) {
        message.error(action.msg);
        return {
            ...state
        };
    }
    return {
        ...state,
        needRefreshData: true
    };
}

/**
 * 获取当前选中要下载文档的信息
 * @param state
 * @param action
 * @returns {{downloadArchiveInfo: {}}}
 */
const setDownloadArchiveInfoReducer = (state, action) => {
    const index = action.downloadArchiveIndex;
    let downloadArchiveInfo = {};

    if (index >= 0 && state.archiveList.length > index) {
        downloadArchiveInfo = state.archiveList[index];
    }

    return {
        ...state,
        downloadArchiveInfo: downloadArchiveInfo,
        downloadArchiveQrCodeUrl: '',
    }
};

/**
 * 构建文档下载用二维码 reducer
 * @param state
 * @param action
 * @returns {*}
 */
const buildArchiveDownloadQRCodeReducer = (state, action) => {
    const succeed = action.status === RES_SUCCEED;

    if (!isStringEmpty(action.msg)) {
        message.error(action.msg);
    }

    if (!succeed) {
        return {
            ...state,
            downloadArchiveQrCodeUrl: '',
        };
    }

    return {
        ...state,
        downloadArchiveQrCodeUrl: action.data.downloadArchiveQrCodeUrl,
    };
};

const initialArchive = {
    selectedProject: null, // 已选择的项目
    selectedPlatform: null, // 已选择的平台
    selectedArchiveDes: null, // 已选择的文档描述
    projectList: [], // 项目列表
    platformList: [{
        value: '1',
        name: 'Android'
    }, {
        value: '2',
        name: 'IOS'
    }], // 平台列表
    archiveCount: 0, // 文档数量
    archiveList: [], // 文档列表
    pageNum: 1, // 当前页码
    pageSize: 10, // 页面容量
    pageLoading: false, // 文档table刷新
    needRefreshData: false, // 是否需要刷新数据
    downloadDialogVisible: false, // 是否显示下载文档弹窗
    downloadArchiveInfo: {}, // 需要下载的文档信息
    downloadArchiveQrCodeUrl: '', // 下载文档二维码地址
};

/**
 * dashboard reducer模块分发
 * @param state
 * @param action
 * @returns {*}
 */
export function archive(state = initialArchive, action) {
    let newState = state;
    switch (action.type) {
        case ACTION_ARCHIVE_SELECT_PROJECT:
            newState = {
                ...state,
                selectedProject: action.data.selectedProject
            };
            break;
        case ACTION_ARCHIVE_SELECT_PLATFORM:
            newState = {
                ...state,
                selectedPlatform: action.data.selectedPlatform
            };
            break;
        case ACTION_ARCHIVE_SELECT_ARCHIVE_DES:
            newState = {
                ...state,
                selectedArchiveDes: action.data.archiveDes
            };
            break;
        case ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED:
            newState = fetchAllProjectsReducer(state, action.data);
            break;
        case ACTION_ARCHIVE_FETCH_ARCHIVES_FULFILLED:
            newState = fetchAllArchivesReducer(state, action.data);
            break;
        case ACTION_ARCHIVE_DELETE_ARCHIVE_FULFILLED:
            newState = deleteArchiveReducer(state, action.data);
            break;
        case ACTION_DOWNLOAD_ARCHIVE_DIALOG_VISIBLE:
            newState = {
                ...state,
                downloadDialogVisible: action.data.downloadDialogVisible,
            };
            break;
        case ACTION_ARCHIVE_SET_DOWNLOAD_INFO:
            newState = setDownloadArchiveInfoReducer(state, action.data);
            break;
        case ACTION_ARCHIVE_BUILD_DOWNLOAD_QR_CODE_FULFILLED:
            newState = buildArchiveDownloadQRCodeReducer(state, action.data);
            break;
        default:
    }
    return newState;
}