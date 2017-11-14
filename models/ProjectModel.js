// project models
import Mongoose from "mongoose";
import {getDate} from "../util/TimeUtil";
const Schema = Mongoose.Schema;

/**
 * 项目schema 包含项目基本信息
 */
const ProjectSchema = new Schema({
    projectName: {type: String, unique: true},
    avatar: {type: String},
    des: {type: String, default: '什么都没写'},
    createdDate: {type: String, default: getDate()},
});

export default Mongoose.model('Project', ProjectSchema);