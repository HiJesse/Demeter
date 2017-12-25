// orm paging
import * as LogUtil from "../../util/LogUtil";

const TAG = 'ORMPaging';

/**
 * orm 分页插件
 *
 * 提供获取所有分页数
 * 提供按页查询
 *
 * @returns {{define: (function(*=))}}
 */
export const ormPaging = () => {
    return {
        define: (model) => {
            model.settings.set("pagination.perpage", 20);

            /**
             * 按页获取信息
             * @param findParams 查找参数
             * @param pageNum 页码
             */
            model.page = (findParams, pageNum) => {
                const perPage = model.settings.get("pagination.perpage");

                return model.find(findParams).order('-createdAt').offset((pageNum - 1) * perPage).limit(perPage);
            };

            /**
             * 获取所有分页数量
             * @param countParams 查找参数
             * @param cb 回调
             */
            model.pages = (countParams, cb) => {
                model.count(countParams, (err, count) => {
                    if (err) {
                        LogUtil.e(`${TAG} count ${err}`);
                        return cb(err);
                    }

                    return cb(null, Math.ceil(count / model.settings.get("pagination.perpage")));
                });
            };
        }
    }
};