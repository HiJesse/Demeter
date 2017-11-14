import Mongoose from "mongoose";
const Schema = Mongoose.Schema;

const UserSchema = new Schema({
    nickName: {type: String, default: '匿名'},
    account: {type: String, unique: true},
    pwd: {type: String},
    isAdmin: {type: Boolean, default: false},
    accessToken: {type: String},
});


export default Mongoose.model('User', UserSchema);