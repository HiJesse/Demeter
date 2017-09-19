// epics
import {combineEpics} from "redux-observable";
import {userManagerEpics} from "./userManager";
import {userEpics} from "./user";
import {projectManagerEpics} from "./projectManager";
import {projectMembersManagerEpics} from "./projectMembersManager";
import {dashboardEpics} from "./dashboard";


export const epics = combineEpics(
    userEpics,
    userManagerEpics,
    projectManagerEpics,
    projectMembersManagerEpics,
    dashboardEpics
);