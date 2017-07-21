import { combineReducers } from 'redux';
import {user} from "./user";
import {home} from "./home";


const reducers = combineReducers({
    user,
    home
});

export default reducers;