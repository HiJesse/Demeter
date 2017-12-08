// dashboard api
import {buildResponse} from "../../util/AjaxUtil";
import {
    RES_FAILED_FETCH_DASHBOARD,
    RES_FAILED_PARAMS_INVALID,
    RES_MSG_FETCH_DASHBOARD,
    RES_MSG_PARAMS_INVALID,
    RES_SUCCEED
} from "../status/Status";
import {isStringEmpty} from "../../util/CheckerUtil";
import {countUser, isUserExist} from "../../models/UserModel";
import {countProject} from "../../models/ProjectModel";
import * as LogUtil from "../../util/LogUtil";
import {buildProjectErrorStatus} from "../status/ProjectErrorMapping";

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
        [status, msg] = buildProjectErrorStatus(err, status, msg);
        res.json(buildResponse(status, {}, msg));
    });
};