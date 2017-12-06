// dashboard api
import {buildResponse} from "../../util/AjaxUtil";
import {
    RES_FAILED_COUNT_PROJECT,
    RES_FAILED_COUNT_USER,
    RES_FAILED_FETCH_DASHBOARD,
    RES_FAILED_FIND_USER_INFO,
    RES_FAILED_PARAMS_INVALID,
    RES_FAILED_USER_IS_NOT_EXIST,
    RES_MSG_COUNT_PROJECT,
    RES_MSG_COUNT_USER,
    RES_MSG_FETCH_DASHBOARD,
    RES_MSG_FIND_USER_INFO,
    RES_MSG_PARAMS_INVALID,
    RES_MSG_USER_IS_NOT_EXIST,
    RES_SUCCEED
} from "../Status";
import {isObjectEmpty, isStringEmpty} from "../../util/CheckerUtil";
import {countUser, isUserExist} from "../../models/UserModel";
import {countProject} from "../../models/ProjectModel";
import * as LogUtil from "../../util/LogUtil";

const TAG = 'UserApi';

/**
 * 获取仪表盘信息
 * 1. 校验用户是否存在
 * 2. 获取用户总数
 * 3. 获取项目总数
 * @param req
 * @param res
 */
export const fetchDashboard = (req, res) => {
    const uId = req.query.uId;

    const result = {
        userCount: 0,
        projectCount: 0
    };

    LogUtil.i(`${TAG} fetchDashboard ${uId}`);

    if (isStringEmpty(uId)) {
        res.json(buildResponse(RES_FAILED_PARAMS_INVALID, {}, RES_MSG_PARAMS_INVALID));
        return;
    }

    let status = RES_FAILED_FETCH_DASHBOARD;
    let msg = RES_MSG_FETCH_DASHBOARD;

    isUserExist({
        id: uId
    }).then(() => {
        return countUser({});
    }).then((data) => {
        result.userCount = data;
        return countProject({})
    }).then((data) => {
        result.projectCount = data;
        res.json(buildResponse(RES_SUCCEED, result, '查询成功'));
    }).catch((err) => {
        LogUtil.e(`${TAG} fetchUserList ${JSON.stringify(err)}`);
        if (isObjectEmpty(err)) {
            status = RES_FAILED_FETCH_DASHBOARD;
            msg = RES_MSG_FETCH_DASHBOARD;
        } else if (err.userNotExist) {
            status = RES_FAILED_USER_IS_NOT_EXIST;
            msg = RES_MSG_USER_IS_NOT_EXIST;
        } else if (err.isUserExistError) {
            status = RES_FAILED_FIND_USER_INFO;
            msg = RES_MSG_FIND_USER_INFO;
        } else if (err.countUserError) {
            status = RES_FAILED_COUNT_USER;
            msg = RES_MSG_COUNT_USER;
        } else if (err.countProjectError) {
            status = RES_FAILED_COUNT_PROJECT;
            msg = RES_MSG_COUNT_PROJECT;
        }
        res.json(buildResponse(status, {}, msg));
    });
};