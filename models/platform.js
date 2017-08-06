import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

/**
 * 平台schema 正常包括 0 Android 1 IOS
 */
const PlatformSchema = new Schema({
    platformId: {type: Number, unique: true},
    des: {type: String, default: 'Android'},
});


export default Mongoose.model('Platform', PlatformSchema);