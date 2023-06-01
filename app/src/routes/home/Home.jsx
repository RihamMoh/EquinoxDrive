import { React, Component, Fragment } from "react";
import { NavLine, Body, Footer } from "../../components/home";
import "../../stylesheets/home/Home.css";
import { Wsclient, WsConnect } from "../../common/Wsconnection";
import { WsStartProcess } from "./StartProcess";
import axios from "axios";
import { v1 as uuidv1 } from "uuid";
import { encode as base64_encode } from "base-64";
import { retriveTable } from "../../components/home/Body/DirTable";
import { getWindowStatus, getCompresedFileName } from "../../components/common";

export default class Home extends Component {
  state = {
    wsclient: null,
    status: 0,
    data: {
      BasicData: {},
      dirTableFiles: null,
      fileProps: null,
      currentDir: "",
    },
    progressHistory: {
      newProgressCount: 0,
      progress: {},
    },
    notificationsHistory: {
      newNotificationsCount: 0,
      notifications: {},
    },
    dirTable: {
      selectedFiles: {},
    },
    windowsResolution: {
      width: window.innerWidth,
      height: window.innerHeight,
      widthStatus: getWindowStatus({ width: window.innerWidth }),
      heightStatus: getWindowStatus({ height: window.innerHeight }),
    },
  };
  genarateNotification = (status, msg) => {
    this.setState({
      notificationsHistory: {
        ...this.state.notificationsHistory,
        newNotificationsCount:
          this.state.notificationsHistory.newNotificationsCount + 1,
        notifications: {
          ...this.state.notificationsHistory.notifications,
          [uuidv1()]: { Status: status, msg: msg },
        },
      },
    });
  };
  refreshDirTable = () => {
    retriveTable(this.state.wsclient, this.state.data.currentDir);
  };
  setWsclient = (client, wsstatus) => {
    this.setState({ wsclient: client, status: wsstatus });
  };
  setData = (updatedData) => {
    let Cpstatedata = { ...this.state.data };
    Object.entries(updatedData).forEach(([key, val]) => {
      Cpstatedata[key] = val;
    });
    this.setState({ data: Cpstatedata });
  };
  downloadFiles = (files) => {
    const url =
      "http://192.168.1.5:8008/downloadfile/" +
      base64_encode(JSON.stringify(this.state.data.currentDir)) +
      "/" +
      base64_encode(JSON.stringify(files)); // "/token"
    const DownloadReqController = new AbortController();
    const options = {
      responseType: "blob",
      signal: DownloadReqController.signal,
      onDownloadProgress: ({ total, loaded }) => {
        const percentageComplete = Math.floor((loaded / total) * 100);
        const cpProgressHistory = { ...this.state.progressHistory };
        cpProgressHistory.progress[fileName] = {
          ...this.state.progressHistory.progress[fileName],
          progressVal: percentageComplete,
        };
        this.setState({
          progressHistory: cpProgressHistory,
        });
      },
    };
    const fileName =
      files.length > 1 ||
      (files.length === 1 &&
        (this.state.data.dirTableFiles.filter(
          (file) => file.file === files[0]
        )[0].type === "dir"
          ? 1
          : this.state.data.dirTableFiles.filter(
              (file) => file.file === files[0]
            )[0].size > this.state.data.BasicData.maxFileDownloadSize))
        ? this.state.data.BasicData.downloadFileName + uuidv1() + ".zip"
        : files[0]
            .split(".")
            .splice(0, files[0].split(".").length - 1)
            .join(".") +
          uuidv1() +
          "." +
          files[0].split(".")[files[0].split(".").length - 1]; // the progress of creating new download filename for the downloading file
    this.setState({
      progressHistory: {
        ...this.state.progressHistory,
        newProgressCount: this.state.progressHistory.newProgressCount + 1,
        progress: {
          ...this.state.progressHistory.progress,
          [fileName]: {
            filestatus: "downloading",
            transfermethod: "download",
            progressVal: 0,
            cancel: () => {
              DownloadReqController.abort();
              let cpProgressHistory = {
                ...this.state.progressHistory,
              };
              delete cpProgressHistory.progress[fileName];
              this.setState({ progressHistory: cpProgressHistory });
            },
          },
        },
      },
    });
    axios
      .get(url, options)
      .then((res) => {
        this.setState({
          progressHistory: {
            ...this.state.progressHistory,
            progress: {
              ...this.state.progressHistory.progress,
              [fileName]: {
                ...this.state.progressHistory.progress[fileName],
                progressVal: 100,
              },
            },
          },
        });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.setAttribute("download", fileName); //or any other extension
        document.body.appendChild(downloadLink);
        downloadLink.click();
      })
      .catch((err) =>
        this.genarateNotification(
          "error",
          `There is an error occur while downloading ${getCompresedFileName(
            fileName,
            23
          )} .`
        )
      );
  };
  uploadFiles = (files) => {
    const url = "http://192.168.1.5:8008/uploadfile/";
    let tmpProgressHistory = {
      ...this.state.progressHistory,
      newProgressCount: this.state.progressHistory.newProgressCount,
      progress: { ...this.state.progressHistory.progress },
    };
    Object.values(files).forEach((file) => {
      const UploadReqController = new AbortController();
      const fileName = file.name;
      if (!file || !fileName) return 0; // err
      let uploadData = new FormData();
      uploadData.append(this.state.data.currentDir + fileName, file);
      const options = {
        signal: UploadReqController.signal,
        onUploadProgress: ({ total, loaded }) => {
          const percentageComplete = Math.floor((loaded / total) * 100);
          this.setState({
            progressHistory: {
              ...this.state.progressHistory,
              progress: {
                ...this.state.progressHistory.progress,
                [fileName]: {
                  ...this.state.progressHistory.progress[fileName],
                  progressVal: percentageComplete,
                },
              },
            },
          });
        },
      };
      tmpProgressHistory = {
        ...tmpProgressHistory,
        newProgressCount: tmpProgressHistory.newProgressCount + 1,
        progress: {
          ...tmpProgressHistory.progress,
          [fileName]: {
            filestatus: "uploading",
            transfermethod: "upload",
            progressVal: 0,
            cancel: () => {
              UploadReqController.abort();
              let cpProgressHistory = { ...this.state.progressHistory };
              delete cpProgressHistory.progress[fileName];
              this.setState({ progressHistory: cpProgressHistory });
            },
          },
        },
      };
      return axios
        .post(url, uploadData, options)
        .then(({ data }) => {
          if (data.rcode == 0) {
            this.setState({
              progressHistory: {
                ...this.state.progressHistory,
                progress: {
                  ...this.state.progressHistory.progress,
                  [fileName]: {
                    ...this.state.progressHistory.progress[fileName],
                    progressVal: 100,
                  },
                },
              },
            });
            this.genarateNotification(
              "success",
              `The ${getCompresedFileName(fileName, 23)} has uploaded.`
            );
          }
          this.refreshDirTable();
        })
        .catch(({ response: { data } }) => {
          if (data.rcode === 1) {
            this.state.progressHistory.progress[fileName].cancel();
            this.state.setState({
              progressHistory: {
                ...this.state.progressHistory,
                newProgressCount:
                  this.state.progressHistory.newProgressCount - 1,
              },
            });
            this.genarateNotification(
              "error",
              `There ia an error occur while uploading ${getCompresedFileName(
                fileName,
                23
              )}`
            );
          }
        });
    });
    this.setState({ progressHistory: tmpProgressHistory });
  };
  componentWillMount() {
    WsConnect(
      this.setWsclient,
      this.setData,
      WsStartProcess,
      () => this.state.data,
      this.refreshDirTable,
      this.genarateNotification
    );
  }
  componentDidMount() {
    window.addEventListener("resize", () => {
      this.setState({
        windowsResolution: {
          ...this.state.windowsResolution,
          width: window.innerWidth,
          height: window.innerHeight,
          widthStatus: getWindowStatus({ width: window.innerWidth }),
        },
      });
    });
  }
  updateDirTableFileSelect = (mode, id, details) => {
    let cpSelectedFiles = { ...this.state.dirTable.selectedFiles };
    if (mode === "add") cpSelectedFiles[id] = details;
    else if (mode === "addAll")
      this.state.data.dirTableFiles.map(
        (row, rowindex) => (cpSelectedFiles[`tbody-row${rowindex}-col-0`] = row)
      );
    else if (mode === "remove") delete cpSelectedFiles[id];
    else cpSelectedFiles = {};
    this.setState({ dirTable: { selectedFiles: cpSelectedFiles } });
  };
  changeDir = (dir) => {
    this.updateDirTableFileSelect("removeAll");
    retriveTable(this.state.wsclient, dir);
  };
  render() {
    return (
      <Wsclient.Provider
        value={{
          wsclient: this.state.wsclient,
          wsstatus: this.state.status,
          data: this.state.data,
        }}
      >
        <NavLine
          currentDir={this.state.data.currentDir}
          DirTableSelectedFiles={this.state.dirTable.selectedFiles}
          updateDirTableFileSelect={this.updateDirTableFileSelect}
          uploadFiles={this.uploadFiles}
          downloadFiles={this.downloadFiles}
          DirTableFileSelect={this.state.dirTable.selectedFiles}
          Wsclient={this.state.wsclient}
          data={this.state.data}
          changeDir={this.changeDir}
          refreshDirTable={this.refreshDirTable}
          windowsResolution={this.state.windowsResolution}
        />
        <Body
          currentDir={this.state.data.currentDir}
          Wsclient={this.state.wsclient}
          fileProps={this.state.data.fileProps}
          downloadFiles={this.downloadFiles}
          updateDirTableFileSelect={this.updateDirTableFileSelect}
          DirTableFileSelect={this.state.dirTable.selectedFiles}
          changeDir={this.changeDir}
          refreshDirTable={this.refreshDirTable}
          windowsResolution={this.state.windowsResolution}
        />
        <Footer
          progressHistory={this.state.progressHistory}
          resetProgressHistoryCount={() =>
            this.setState({
              progressHistory: {
                ...this.state.progressHistory,
                newProgressCount: 0,
              },
            })
          }
          notificationsHistory={this.state.notificationsHistory}
          setNotifications={(newNotifications) =>
            this.setState({
              notificationsHistory: {
                ...this.state.notificationsHistory,
                notifications: newNotifications,
              },
            })
          }
          resetNotificationHistoryCount={() =>
            this.setState({
              notificationsHistory: {
                ...this.state.notificationsHistory,
                newNotificationsCount: 0,
              },
            })
          }
          currentDirFullPath={
            this.state.data.BasicData.rootDir + this.state.data.currentDir
          }
          refreshDirTable={this.refreshDirTable}
          windowsResolution={this.state.windowsResolution}
        />
      </Wsclient.Provider>
    );
  }
}
