import fetch from 'isomorphic-fetch'

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
 * 以post方法请求接口
 * @param url
 * @param params
 */
export function post(url, params) {
    let data = {
        'method': 'POST',
        'Content-Type': 'application/json',
        'dataType':'json',
        'body': JSON.stringify(params)
    };

    return fetch(url, data)
}

/**
 * 以get方式请求接口
 * @param url
 * @param params
 */
export function get(url, params) {
    if (!url.endsWith('?')) {
        url += '?';
    }

    const fetchPromise = fetch(url + buildParams(params));

    return new Promise((resolve, reject) => {

        fetchPromise.then((response) => {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    resolve(data);

                });
            } else {
                reject(buildErrorInfo(-2, 'response code error'))
            }
        }).catch((e) => {
            reject(buildErrorInfo(-1, e.toString()));
        });
    });
}