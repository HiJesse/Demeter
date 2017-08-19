// user api
import projectModel from "../../models/project";
import {
    RES_SUCCEED
} from "../../util/status";

export const createProject = (req, res) => {
    console.log(req.file);
    console.log(req.body.projectName);
    console.log(req.body.projectDes);
};