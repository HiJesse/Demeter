// dashboard api
import {buildResponse} from "../../util/AjaxUtil";
import {
    RES_FAILED_COUNT_USER,
    RES_FAILED_FETCH_DASHBOARD,
    RES_FAILED_USER_NONE,
    RES_MSG_COUNT_USER,
    RES_MSG_FETCH_DASHBOARD,
    RES_MSG_USER_NONE,
    RES_SUCCEED
} from "../Status";
import {isObjectEmpty} from "../../util/CheckerUtil";
import {countUsers, isUserExist} from "./base/BaseUserApi";
import {countProjects} from "./base/BaseProjectApi";


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

    //TODO 先返回成功, 重构完项目模块后再修改
    res.json(buildResponse(RES_SUCCEED, result, ''));
    return;

    let status = RES_FAILED_FETCH_DASHBOARD;
    let msg = RES_MSG_FETCH_DASHBOARD;

    isUserExist({_id: uId}).then(() => {
        return countUsers();
    }).then((data) => {
        result.userCount = data.userCount;
        return countProjects({})
    }).then((data) => {
        result.projectCount = data.projectCount;
        status = RES_SUCCEED;
        msg = null;
        res.json(buildResponse(status, result, msg));
    }).catch((error) => {
        if (isObjectEmpty(error)) {
            status = RES_FAILED_FETCH_DASHBOARD;
            msg = RES_MSG_FETCH_DASHBOARD;
        } else if (error.isUserExist === false) {
            status = RES_FAILED_USER_NONE;
            msg = RES_MSG_USER_NONE;
        } else if (error.userCount === -1) {
            status = RES_FAILED_COUNT_USER;
            msg = RES_MSG_COUNT_USER;
        }
        res.json(buildResponse(status, {}, msg));
    });
};