// log util
import log4js from "log4js";
import * as Config from "../config/Config";

let demeterLogger;

/**
 * 初始化 logger
 * @returns {any}
 */
export const initLog = () => {
    log4js.configure(Config.CONFIG_LOG);
    demeterLogger = log4js.getLogger('Demeter');
    demeterLogger.level = Config.env.LOG_LEVEL;
    return log4js.connectLogger(demeterLogger);
};

/**
 * debug level
 * @param debug
 */
export const d = (debug) => demeterLogger.debug(debug);

/**
 * info level
 * @param info
 */
export const i = (info) => demeterLogger.info(info);

/**
 * error level
 * @param error
 */
export const e = (error) => demeterLogger.error(error);