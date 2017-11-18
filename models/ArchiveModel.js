import Mongoose from "mongoose";
import {getDate} from "../util/TimeUtil";
const Schema = Mongoose.Schema;

const ArchiveSchema = new Schema({
    projectId: {type: String}, // 项目ID
    platformId: {type: String}, // 平台ID
    des: {type: String, default: '什么都没写'}, // 文档描述
    archiveName: {type: String, required: true}, // 文档名称
    archivePath: {type: String, required: true}, // 文档路径
    archiveSize: {type: Number}, // 文档大小 MB
    createDate: {type: String, default: getDate()}, // 文档创建时间
});


export default Mongoose.model('Archive', ArchiveSchema);