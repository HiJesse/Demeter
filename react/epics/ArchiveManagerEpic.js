// archive epics
import {combineEpics} from "redux-observable";
import {Observable} from "rxjs";
import {
    ACTION_ARCHIVE_BUILD_DOWNLOAD_QR_CODE,
    ACTION_ARCHIVE_BUILD_DOWNLOAD_QR_CODE_FULFILLED,
    ACTION_ARCHIVE_DELETE_ARCHIVE,
    ACTION_ARCHIVE_DELETE_ARCHIVE_FULFILLED,
    ACTION_ARCHIVE_FETCH_ALL_PROJECTS,
    ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED,
    ACTION_ARCHIVE_FETCH_ARCHIVES,
    ACTION_ARCHIVE_FETCH_ARCHIVES_FULFILLED,
    ACTION_ARCHIVE_UPLOAD,
    ACTION_ARCHIVE_UPLOAD_FULFILLED
} from "../constants/ActionType";
import {AJAX_METHOD, ajaxRequest} from "../../util/AjaxUtil";
import {
    URL_CREATE_ARCHIVE,
    URL_DELETE_ARCHIVE_LIST,
    URL_FETCH_ARCHIVE_LIST,
    URL_FETCH_JOINED_PROJECT_LIST,
    URL_FETCH_PROJECT_LIST
} from "../constants/Url";
import {isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import {buildQRCode} from "../utils/QRCodeUtil";
import {RES_FAILED, RES_SUCCEED} from "../../api/status/Status";

/**
 * 上传文档 epic
 * @param action$
 */
export const uploadArchiveEpic = action$ =>
    action$.ofType(ACTION_ARCHIVE_UPLOAD)
        .mergeMap(action => {

            if (isObjectEmpty(action.data.archive) ||
                isObjectEmpty(action.data.projectId) ||
                isObjectEmpty(action.data.platformId)) {
                return [];
            }

            return ajaxRequest({
                actionType: ACTION_ARCHIVE_UPLOAD_FULFILLED,
                method: AJAX_METHOD.POST_MULTI_FORM,
                url: URL_CREATE_ARCHIVE,
                params: action.data
            })
        });

/**
 * 获取项目所有列表 epic
 * @param action$
 */
export const fetchProjectsEpic = action$ =>
    action$.ofType(ACTION_ARCHIVE_FETCH_ALL_PROJECTS)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_ARCHIVE_FETCH_ALL_PROJECTS_FULFILLED,
            method: AJAX_METHOD.GET,
            url: action.data.isAdmin ? URL_FETCH_PROJECT_LIST : URL_FETCH_JOINED_PROJECT_LIST,
            params: action.data
        }));

/**
 * 获取文档列表 epic
 * @param action$
 */
export const fetchArchivesEpic = action$ =>
    action$.ofType(ACTION_ARCHIVE_FETCH_ARCHIVES)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_ARCHIVE_FETCH_ARCHIVES_FULFILLED,
            method: AJAX_METHOD.GET,
            url: URL_FETCH_ARCHIVE_LIST,
            params: action.data
        }));

/**
 * 删除文档 epic
 * @param action$
 */
export const deleteArchiveEpic = action$ =>
    action$.ofType(ACTION_ARCHIVE_DELETE_ARCHIVE)
        .mergeMap(action => ajaxRequest({
            actionType: ACTION_ARCHIVE_DELETE_ARCHIVE_FULFILLED,
            method: AJAX_METHOD.POST,
            url: URL_DELETE_ARCHIVE_LIST,
            params: action.data
        }));

/**
 * 构建文档下载二维码 epic
 *
 * 1. 下载地址为空直接返回失败
 * 2. 使用qrcode 和下载地址生成二维码
 * 3. 转发fulfilled action
 *
 * @param action$
 */
export const buildArchiveDownloadQRCodeEpic = action$ =>
    action$.ofType(ACTION_ARCHIVE_BUILD_DOWNLOAD_QR_CODE)
        .mergeMap(action => {
            const data = action.data;
            const returnData = {
                type: ACTION_ARCHIVE_BUILD_DOWNLOAD_QR_CODE_FULFILLED
            };

            const archive = data.archive;

            if (isStringEmpty(archive)) {
                returnData.data = {
                    status: RES_FAILED,
                };
                return Observable.of(returnData);
            }

            let codePromise;
            // ios ipa 有OTA地址
            if (archive.platform === 2 && archive.archiveName.endsWith('ipa') && !isStringEmpty(archive.archiveExtraData)) {
                codePromise = buildQRCode(archive.archiveExtraData);
            } else {
                codePromise = buildQRCode(archive.archivePath);
            }

            const observable = Observable.fromPromise(codePromise);

            return observable.map(data => {
                returnData.data = {
                    status: RES_SUCCEED,
                    data: {
                        downloadArchiveQrCodeUrl: data.qrCodeUrl
                    }
                };
                return returnData;
            }).catch(() => {
                returnData.data = {
                    status: RES_FAILED,
                    msg: '生成二维码失败',
                };
                return Observable.of(returnData);
            });
        });


/**
 * archive epic方法汇总
 */
export const ArchiveManagerEpics = combineEpics(
    uploadArchiveEpic,
    fetchProjectsEpic,
    fetchArchivesEpic,
    deleteArchiveEpic,
    buildArchiveDownloadQRCodeEpic
);