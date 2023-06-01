import React, { useEffect, Component } from "react";
import { ShowModelAlert, ModalAlert } from "../../common";
import $ from "jquery";
import { MakeDirModelAlertBody } from "./subComponents";
import "../../../stylesheets/home/NavLine.css";

const FileOptions = ({
  DirTableSelectedFilesLength,
  DirTableFilesLength,
  handleSelectAllCheckboxChange,
  handleDownloadClick,
  handleRemoveClick,
  handleFileUploadSelect,
  handlePreviousDirClick,
  handleMakeDirClick,
  windowsResolution,
}) => {
  useEffect(() => {
    const selectAllCheckboxBtn = $(
      "div#file-options > div > div#selected-file-count > input#file-options-select-all-checkbox"
    );
    if (DirTableSelectedFilesLength === DirTableFilesLength) {
      selectAllCheckboxBtn.prop("indeterminate", false);
      selectAllCheckboxBtn.prop("checked", true);
    } else if (!selectAllCheckboxBtn.prop("indeterminate")) {
      selectAllCheckboxBtn.prop("indeterminate", true);
      selectAllCheckboxBtn.prop("checked", false);
    }
  }, [DirTableSelectedFilesLength]);
  return (
    <div id="file-options">
      <h1 className="px-1 pb-1">EquinoxDrive</h1>
      <div id="options" className="d-flex flex-row align-items-center">
        {DirTableSelectedFilesLength > 0 ? (
          <React.Fragment>
            <div
              id="selected-file-count"
              className="px-2 py-1 my-1 cursor-pointer"
            >
              <input
                type="checkbox"
                className=" form-check-input cursor-pointer me-2"
                id="file-options-select-all-checkbox"
                onChange={(evt) =>
                  handleSelectAllCheckboxChange(evt.target.checked)
                }
              />
              <span className="text me-2 fs-sm">
                {DirTableSelectedFilesLength}{" "}
                {windowsResolution.widthStatus !== "xsm" ? "selected" : ""}
              </span>
            </div>
            <i
              className="bi bi-trash px-2 py-1 my-1 cursor-pointer"
              onClick={handleRemoveClick}
            ></i>
            <i
              className="bi bi-download px-2 py-1 my-1 cursor-pointer"
              onClick={(evt) => handleDownloadClick(evt)}
            ></i>
          </React.Fragment>
        ) : (
          ""
        )}
        <label htmlFor="files-upload-select">
          <i className="bi bi-upload px-2 py-2 my-1 cursor-pointer">
            <input
              type="file"
              id="files-upload-select"
              className="d-none"
              onChange={(evt) => handleFileUploadSelect(evt.target.files)}
              multiple
            />
          </i>
        </label>
        <i
          className="bi bi-folder-minus px-2 py-1 my-1 cursor-pointer"
          onClick={handlePreviousDirClick}
        ></i>
        <i
          className="bi bi-folder-plus px-2 py-1 my-1 cursor-pointer"
          onClick={(evt) => handleMakeDirClick(evt)}
        ></i>
      </div>
    </div>
  );
};
const OtherOptions = ({ refreshDirTable }) => {
  return (
    <button
      className="refresh d-flex flex-row align-items-center btn-secondary btn"
      type="button"
      onClick={refreshDirTable}
    >
      <span className="icon me-1">
        <i className="bi bi-arrow-clockwise"></i>
      </span>
      <span className="text">Refresh</span>
    </button>
  );
};
export default class NavLine extends Component {
  state = {
    modelAlert: {
      controlls: [],
      title: "",
      content: "",
      submitBtnTitle: "",
      onSubimtClick: null,
      onCloseBtnClick: null,
      disabled: false,
    },
  };
  handleSelectAllCheckboxChange = (checked) => {
    if (checked) {
      this.props.updateDirTableFileSelect("addAll");
    } else {
      this.props.updateDirTableFileSelect("removeAll");
    }
  };
  handleDownloadClick = (evt) => {
    this.props.downloadFiles(
      Object.values(this.props.DirTableFileSelect).map(({ file }) => file)
    );
    this.props.updateDirTableFileSelect("removeAll");
  };
  handleRemoveClick = () => {
    this.setState({
      modelAlert: {
        controlls: ["close"],
        title: "Remove Files",
        content:
          "do you want to remove this file. because it removed it forever and didn't restore it.",
        submitBtnTitle: "Remove",
        onSubimtClick: () => {
          this.props.Wsclient.send(
            JSON.stringify({
              topic: "RemoveFiles",
              filenames: Object.values(this.props.DirTableFileSelect).map(
                ({ file }) => this.props.currentDir + file
              ),
            })
          );
          this.props.updateDirTableFileSelect("removeAll");
        },
        onCloseBtnClick: () => {
          this.setState({
            controlls: [],
            title: "",
            content: "",
            submitBtnTitle: "",
            onSubimtClick: null,
            onCloseBtnClick: null,
            disabled: false,
          });
        },
        disabled: false,
      },
    });
    ShowModelAlert("div#navline");
  };
  handleFileUploadSelect = (files) => {
    this.props.uploadFiles(files);
    this.props.updateDirTableFileSelect("removeAll");
  };
  changeToPreviousDir = () => {
    console.log(this.props.currentDir.split("/"));
    this.props.changeDir(
      this.props.currentDir
        .split("/")
        .slice(0, this.props.currentDir.split("/").length - 2)
        .join("/") + (this.props.currentDir.split("/").length > 2 ? "/" : "")
    );
  };
  MakeDir = () => {
    this.setState({
      modelAlert: {
        controlls: [],
        title: "Make New Folder",
        content: (
          <MakeDirModelAlertBody
            inputId="make-dir-model-alert-body"
            defaultFolderName="NewFolder"
            dirTableFiles={this.props.data.dirTableFiles}
            setModelAlert={(val) =>
              this.setState({
                modelAlert: { ...this.state.modelAlert, ...val },
              })
            }
          />
        ),
        submitBtnTitle: "create",
        onSubimtClick: () => {
          const value = $(
            "div#model-alert-outershell > div#model-alertbox input#make-dir-model-alert-body"
          ).val();
          if (value || value.length > 0) {
            this.props.Wsclient.send(
              JSON.stringify({
                topic: "MakeDir",
                currentDir: this.props.currentDir,
                dirname: value,
              })
            );
            this.props.updateDirTableFileSelect("removeAll");
          }
        },
        onCloseBtnClick: () => {
          this.setState({
            modelAlert: {
              controlls: [],
              title: "",
              content: "",
              submitBtnTitle: "",
              onSubimtClick: null,
              onCloseBtnClick: null,
              disabled: false,
            },
          });
        },
        disabled: false,
      },
    });
    ShowModelAlert("div#navline");
  };
  render() {
    return (
      <div
        id="navline"
        className="navline d-flex flex-row justify-content-between align-items-center pb-2 bg-f7f7f7 px-3 pt-2"
      >
        <ModalAlert {...this.state.modelAlert} />
        <FileOptions
          DirTableSelectedFilesLength={
            Object.keys(this.props.DirTableSelectedFiles).length
          }
          DirTableFilesLength={
            this.props.data.dirTableFiles
              ? this.props.data.dirTableFiles.length
              : -1
          }
          handleSelectAllCheckboxChange={this.handleSelectAllCheckboxChange}
          handleDownloadClick={this.handleDownloadClick}
          handleRemoveClick={this.handleRemoveClick}
          handleFileUploadSelect={this.handleFileUploadSelect}
          handlePreviousDirClick={this.changeToPreviousDir}
          handleMakeDirClick={this.MakeDir}
          windowsResolution={this.props.windowsResolution}
        />
        <OtherOptions refreshDirTable={this.props.refreshDirTable} />
      </div>
    );
  }
}
