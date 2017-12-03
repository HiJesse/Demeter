// orm transaction
import * as LogUtil from "../../util/LogUtil";

const TAG = 'ORMTransaction';

/**
 * 设置数据库事务
 * @param db 数据库连接
 * @returns {{define: define}}
 */
export const ormTransaction = db => {
    db.transaction = function (cb) {
        db.driver.execQuery("BEGIN", function (err) {
            if (err) {
                return cb(err);
            }

            LogUtil.i(`${TAG} init transaction!`);

            return cb(null, {

                /**
                 * 提交事务
                 * @param cb
                 */
                commit: function (cb) {
                    db.driver.execQuery("COMMIT", function (err) {
                        LogUtil.i(`${TAG} transaction committed!`);
                        return cb(err || null);
                    });
                },

                /**
                 * 回滚事务
                 * @param cb
                 */
                rollback: function (cb) {
                    db.driver.execQuery("ROLLBACK", function (err) {
                        LogUtil.i(`${TAG} transaction rolled back!`);
                        return cb(err || null);
                    });
                }
            });
        });
    };

    return {
        define: function (Model) {
        }
    };
};
