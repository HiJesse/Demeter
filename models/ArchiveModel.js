import Mongoose from "mongoose";
import {getDate} from "../util/TimeUtil";
const Schema = Mongoose.Schema;

const ArchiveSchema = new Schema({
    projectId: {type: String},
    platformId: {type: String},
    des: {type: String},
    size: {type: Number},
    createDate: {type: String, default: getDate()},
});


export default Mongoose.model('Archive', ArchiveSchema);