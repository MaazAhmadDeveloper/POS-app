import express from "express";
import { uploadBackupController, getBackupController } from "../controllers/uploadBackupControllers.js"; 

const userDataUploadRouter = express.Router();

userDataUploadRouter.post("/dataBackup", uploadBackupController);

userDataUploadRouter.get("/getdataBackup", getBackupController);

export default userDataUploadRouter;