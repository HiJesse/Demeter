// ajax
import fetch from "isomorphic-fetch";
import "rxjs";
import {Observable} from "rxjs";
import {RES_FAILED, RES_FAILED_EX, RES_MSG_EX, RES_SUCCEED} from "../api/status/Status";

export const AJAX_METHOD = {
    GET: 'GET',
    POST: 'POST',
    POST_FORM: 'POST_FORM',
    POST_MULTI_FORM: 'POST_MULTI_FORM',
};

/**
 * 构建get时请求参数
 * @param obj json对象
 * @returns {*}
 */
function buildParams(obj) {
    if (!obj) {
        return ''
    }
    const params = [];
    for (const key of Object.keys(obj)) {
        const value = obj[key] === undefined ? '' : obj[key];
        params.push(`${key}=${encodeURIComponent(value)}`);
    }
    return params.join('&');
}

/**
 * 构建错误信息
 * @param code
 * @param msg
 * @returns {{status: *, msg: *}}
 */
function buildErrorInfo(code, msg) {
    return {
        status: code,
        msg: msg
    }
}

/**
 * 构建response json
 * @param status 状态 0：succeed
 * @param params 业务数据
 * @param msg status != 0时的错误信息
 */
export function buildResponse(status, params, msg) {
    return {
        status: status,
        data: params,
        msg: msg
    }
}

/**
 * 根据fetch promise对象构建出一个Observable
 * @param fetch
 * @returns {Observable<T>|*}
 */
const buildRequestObservable = fetch => {
    const request = new Promise((resolve, reject) => {
        fetch.then(response => {
            if (!response.ok) {
                reject(buildErrorInfo(RES_FAILED, 'response code error'));
            }
            return response.json();
        }).then(data => {
            if (data.status === RES_SUCCEED) {
                resolve(data);
            } else {
                reject(data)
            }
        }).catch(() => {
            reject(buildErrorInfo(RES_FAILED_EX, RES_MSG_EX));
        });
    });
    return Observable.fromPromise(request);
};

/**
 * get请求, 返回Observable promise 对象
 * @param url
 * @param params
 * @returns {Observable.<T>|*}
 */
export const ajaxGet = (url, params) => {
    if (!url.endsWith('?')) {
        url += '?';
    }

    const header = {
        method: AJAX_METHOD.GET,
        headers: {
            'Authorization': `Bearer ${localStorage.token}`
        }
    };

    return buildRequestObservable(fetch(url + buildParams(params), header));
};

/**
 * post请求json内容, 返回Observable promise 对象
 * @param url
 * @param params
 * @returns {Observable.<T>|*}
 */
export const ajaxPost = (url, params) => {
    const content = JSON.stringify(params);
    const data = {
        method: AJAX_METHOD.POST,
        headers: {
            'Authorization': `Bearer ${localStorage.token}`,
            "Content-Type": "application/json",
            "Content-Length": content.length.toString()
        },
        body: content
    };

    return buildRequestObservable(fetch(url, data));
};

/**
 * post请求form内容, 返回Observable promise 对象
 * @param method 根据method决定Content type
 * @param url
 * @param params
 * @returns {Observable.<T>|*}
 */
export const ajaxPostForm = (method, url, params) => {
    const formData = new FormData();
    const headers = {
        'Authorization': `Bearer ${localStorage.token}`
    };

    if (method === AJAX_METHOD.POST_FORM) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    }
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            formData.append(key, params[key]);
        }
    }
    const data = {
        method: AJAX_METHOD.POST,
        headers: headers,
        body: formData
    };

    return buildRequestObservable(fetch(url, data));
};

/**
 * 提供给epic事件流使用, 根据参数构建request
 * @param requestParams {actionType, method, url, params}
 */
export const ajaxRequest = requestParams => {
    const {actionType, method, url, params} = requestParams;

    let observable;
    switch (method) {
        case AJAX_METHOD.POST:
            observable = ajaxPost(url, params);
            break;
        case AJAX_METHOD.GET:
            observable = ajaxGet(url, params);
            break;
        case AJAX_METHOD.POST_FORM:
            observable = ajaxPostForm(AJAX_METHOD.POST_FORM, url, params);
            break;
        case AJAX_METHOD.POST_MULTI_FORM:
            observable = ajaxPostForm(AJAX_METHOD.POST_MULTI_FORM, url, params);
            break;
        default:
            observable = ajaxGet(url, params);
    }

    return observable.map(data => ({
        type: actionType,
        data: data
    })).catch(e => Observable.of({
        type: actionType,
        data: e
    }));
};