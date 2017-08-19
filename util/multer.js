// multipart form data util
import Multer from 'multer';

/**
 * 根据module配置storage
 * @param module
 */
const storage = module => Multer.diskStorage({
    destination: './public/upload/' + module,
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// 项目logo
export const ProjectLogoMulter = Multer({storage: storage('projectLogo')});