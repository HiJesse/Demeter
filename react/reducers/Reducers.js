// reducers
import {combineReducers} from "redux";
import {user} from "./UserReducer";
import {home} from "./HomeReducer";
import {userManager} from "./UserManagerReducer";
import {projectManager} from "./ProjectManagerReducer";
import {projectList} from "./ProjectListReducer";
import {projectMembersManager} from "./ProjectMembersManagerReducer";
import {dashboard} from "./DashboardReducer";
import {archive} from "./ArchiveManagerReducer";

// 将reducer组合起来
const reducers = combineReducers({
    user,
    home,
    userManager,
    projectManager,
    projectList,
    projectMembersManager,
    dashboard,
    archive
});

export default reducers;