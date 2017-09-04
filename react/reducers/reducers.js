// reducers
import {combineReducers} from "redux";
import {user} from "./user";
import {home} from "./home";
import {userManager} from "./userManager";
import {projectManager} from "./projectManager";
import {projectList} from "./projectList";
import {projectMembersManager} from "./projectMembersManager";

// 将reducer组合起来
const reducers = combineReducers({
    user,
    home,
    userManager,
    projectManager,
    projectList,
    projectMembersManager
});

export default reducers;