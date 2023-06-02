const WebSocket = require("ws");
const { RetriveFiles, RetriveFileDetails } = require("./RetriveDirDetails.js");
const {
  rootDir,
  downloadFileName,
  maxFileDownloadSize,
  webApp,
} = require("../config.json");
const { RenameFiles, RemoveFiles, MakeNewDir } = require("./HandleFiles");
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
var cors = require("cors");
const { getCompresedFileName } = require("./SubFunctions.js");

const { startExpressApp } = require("./StartExpressApp");
const expressApp = express();
expressApp.use(cors());
expressApp.use(
  fileUpload({
    limits: {
      fileSize: 10 * 1024 * 1024 * 1024, // 10 GB
    },
    abortOnLimit: true,
  })
);
expressApp.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
startExpressApp(expressApp);
expressApp.listen(webApp.port);

const wss = new WebSocket.Server({ port: 9999 });
let wsConnections = {};
let clients = new Map();
wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    try {
      clients.set(ws, uuidv10());
      console.log(msg.toString());
      const retrivedData = JSON.parse(msg);
      if (!retrivedData || !retrivedData.topic)
        ws.send(
          JSON.stringify({
            topic: "notopic",
            error: "The WS request data not found!.",
          })
        );
      let MsgReply = {
        topic: retrivedData.topic + "Reply",
        data: { success: null },
        error: null,
      };
      const { topic } = retrivedData;
      if (topic == "GetBasicDirData")
        MsgReply.data = {
          rootDir: rootDir,
          downloadFileName: downloadFileName,
          maxFileDownloadSize: maxFileDownloadSize,
        };
      else if (topic == "RetriveTable") {
        if (retrivedData.currentDir.includes("../"))
          MsgReply.error = "The RetriveTable Message format is incorrect!.";
        else
          MsgReply.data = {
            data: RetriveFiles(rootDir + retrivedData.currentDir),
            currentDir: retrivedData.currentDir,
          };
      } else if (topic == "RetriveFileDetails") {
        if (retrivedData.filepath.includes("../"))
          MsgReply.error = "The RetriveDetails Message format is incorrect!.";
        else MsgReply.data = RetriveFileDetails(rootDir, retrivedData.filepath);
      } else if (topic == "RenameFile") {
        if (
          retrivedData.oldFilename.includes("../") ||
          retrivedData.newFilename.includes("../") ||
          retrivedData.currentDir.includes("../")
        )
          MsgReply.error = "The RenameFile Message format is incorrect!.";
        else if (
          RenameFiles(
            retrivedData.currentDir + retrivedData.oldFilename,
            retrivedData.currentDir + retrivedData.newFilename
          )
        )
          MsgReply.error = `There is an error occur while renaming the file ${getCompresedFileName(
            retrivedData.oldFilename,
            23
          )}!.`;
        else
          MsgReply.data.success = `The file ${getCompresedFileName(
            retrivedData.oldFilename,
            18
          )} renamed to ${getCompresedFileName(retrivedData.newFilename, 18)}.`;
      } else if (topic == "RemoveFiles") {
        let files = [];
        retrivedData.filenames.forEach((file) => {
          if (file.includes("../"))
            MsgReply.error = "The RemoveFiles Message format is incorrect.";
          else files.push(file);
        });
        if (RemoveFiles(files))
          MsgReply.error =
            "There is an error occur while remove some file/files.";
        else
          MsgReply.data.success =
            "The file/files were/was removed successfuly.";
      } else if (topic == "MakeDir") {
        if (
          retrivedData.currentDir.includes("../") ||
          retrivedData.dirname.includes("../")
        )
          MsgReply.error = "The MakeDir Message format is incorrect.";
        else if (
          MakeNewDir(rootDir + retrivedData.currentDir + retrivedData.dirname)
        )
          MsgReply.data.success = `The folder ${getCompresedFileName(
            retrivedData.dirname,
            23
          )} was successfuly created!.`;
        else
          MsgReply.error = `There is an error occur while creating folder ${getCompresedFileName(
            retrivedData.dirname,
            23
          )}.`;
      } else MsgReply.error = "given WS topic is not defined.";
      ws.send(JSON.stringify(MsgReply));
    } catch (err) {
      console.log(err);
      ws.send(
        JSON.stringify({
          topic: "notopic",
          error: "WS message format is incorrect!.",
        })
      );
    }
  });
  ws.on("close", () => {
    clients.delete(ws);
    ws.close();
  });
});

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function uuidv10() {
  return "xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx-xxx10".replace(
    /[xy]/g,
    function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}
console.log("the process start");
