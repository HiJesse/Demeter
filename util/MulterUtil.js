// multipart form data util
import Multer from "multer";
import {UPLOAD_PATH, UPLOAD_PROJECT_ARCHIVE, UPLOAD_PROJECT_LOGO} from "./PathUtil";

/**
 * 根据module配置storage
 * @param module
 */
const storage = module => Multer.diskStorage({
    destination: UPLOAD_PATH + module,
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// 项目logo
export const ProjectLogoMulter = Multer({storage: storage(UPLOAD_PROJECT_LOGO)});
// 项目 归档
export const ProjectArchiveMulter = Multer({storage: storage(UPLOAD_PROJECT_ARCHIVE)});