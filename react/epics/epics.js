// epics
import {combineEpics} from "redux-observable";
import {userManagerEpics} from "./userManager";
import {userEpics} from "./user";
import {projectManagerEpics} from "./projectManager";
import {projectMembersManagerEpics} from "./projectMembersManager";


export const epics = combineEpics(
    userEpics,
    userManagerEpics,
    projectManagerEpics,
    projectMembersManagerEpics
);