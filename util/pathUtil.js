// path util
import * as Config from "../config";

// base url eg. http://localhost:3000/
const URL_BASE = Config.env.SERVER + ':' + Config.env.SERVER_PORT + '/';
// public url eg. http://localhost:3000/public/
const URL_PUBLIC = URL_BASE + Config.env.PUBLIC_PATH + '/';
// image url eg. http://localhost:3000/public/
const URL_PUBLIC_IMAGE = URL_BASE + Config.env.PUBLIC_PATH + '/image/';
// upload url eg. http://localhost:3000/upload/
const URL_PUBLIC_UPLOAD = URL_BASE + Config.env.PUBLIC_PATH + '/upload/';



export const UPLOAD_PATH = 'public/upload/';
export const UPLOAD_PROJECT_LOGO = 'project_logo/';

// 默认的项目logo
export const URL_PROJECT_LOGO_DEFAULT = URL_PUBLIC_IMAGE + 'project_logo.png';
// 项目logo路径
export const URL_PROJECT_LOGO = URL_PUBLIC_UPLOAD + UPLOAD_PROJECT_LOGO;