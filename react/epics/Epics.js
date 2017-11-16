// epics
import {combineEpics} from "redux-observable";
import {userManagerEpics} from "./UserManagerEpic";
import {userEpics} from "./UserEpic";
import {projectManagerEpics} from "./ProjectManagerEpic";
import {projectMembersManagerEpics} from "./ProjectMembersManagerEpic";
import {dashboardEpics} from "./DashboardEpic";
import {ArchiveManagerEpics} from "./ArchiveManagerEpic";


export const epics = combineEpics(
    userEpics,
    userManagerEpics,
    projectManagerEpics,
    projectMembersManagerEpics,
    dashboardEpics,
    ArchiveManagerEpics
);