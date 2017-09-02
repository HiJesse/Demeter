import Mongoose from "mongoose";
const Schema = Mongoose.Schema;

/**
 * 项目用户相关schema, 其中包括项目id和用户id 用来管理项目中的用户成员
 */
const ProjectUserSchema = new Schema({
    projectId: {type: String},
    userId: {type: String}
});

export default Mongoose.model('ProjectUser', ProjectUserSchema);