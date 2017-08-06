import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

/**
 * 项目schema 包含项目基本信息
 */
const ProjectSchema = new Schema({
    projectName: {type: String, default: '项目'},
    avatar: {type: String},
    des: {type: String, default: '什么都没写'},
    createdDate: {type: Date, default: Date.now},
});

export default Mongoose.model('Project', ProjectSchema);