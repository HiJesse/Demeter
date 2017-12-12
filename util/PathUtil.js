// path util
import * as Config from "../config/Config";

// base url eg. http://localhost:3000/
const URL_BASE = Config.env.SERVER + ':' + Config.env.SERVER_PORT + '/';
// public url eg. http://localhost:3000/public/
const URL_PUBLIC = URL_BASE + Config.env.PUBLIC_PATH + '/';
// image url eg. http://localhost:3000/public/
const URL_PUBLIC_IMAGE = URL_BASE + 'image/';
// upload url eg. http://localhost:3000/upload/
const URL_PUBLIC_UPLOAD = URL_BASE + 'upload/';



export const UPLOAD_PATH = 'public/upload/';
export const UPLOAD_PROJECT_LOGO = 'project_logo/';
export const UPLOAD_PROJECT_ARCHIVE = 'project_archive/';

// 默认的项目logo
export const URL_PROJECT_LOGO_DEFAULT = URL_PUBLIC_IMAGE + 'project_logo.png';
// 项目logo路径
export const URL_PROJECT_LOGO = URL_PUBLIC_UPLOAD + UPLOAD_PROJECT_LOGO;

// 文档下载路径
export const URL_ARCHIVE = URL_PUBLIC_UPLOAD + UPLOAD_PROJECT_ARCHIVE;