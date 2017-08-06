import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

/**
 * 项目平台相关schema, 其中包括项目id 平台id app id
 */
const ProjectPlatformSchema = new Schema({
    projectId: {type: String},
    platformId: {type: String},
    appId: {type: String},
});

export default Mongoose.model('ProjectPlatform', ProjectPlatformSchema);