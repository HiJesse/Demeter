// reducers
import { combineReducers } from 'redux';
import {user} from "./user";
import {home} from "./home";
import {userList} from "./userList";
import {projectManager} from "./projectManager";

// 将reducer组合起来
const reducers = combineReducers({
    user,
    home,
    userList,
    projectManager,
});

export default reducers;