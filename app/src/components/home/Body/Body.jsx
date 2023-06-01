import { React, useState, useEffect, Component } from "react";
import { DirTable } from "./DirTable";
import { FilePopup, FileProperties } from "./FilePopup";
import $ from "jquery";
import { ModalAlert, ShowModelAlert } from "../../common";

export class Body extends Component {
  state = {
    filepopup: {
      filename: null,
      filetype: null,
      filesize: null,
      changedtime: null,
    },
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
  handleFilePopupAction = false;
  handleFilePopup = (evt, toggle = "hide", details) => {
    if (!this.handleFilePopupAction) {
      this.handleFilePopupAction = true;
      const transtion = Number(
        $(":root")
          .css("--filepopup-transition")
          .slice(0, $(":root").css("--filepopup-transition").length - 2)
      );
      const PopupOutershellElm = $("div#outershell");
      const PopupBoxElm = $("div#outershell > div#popupbox");
      if (toggle === "show" && details) {
        const { file, type, size, changed } = details;
        FileProperties(this.props.Wsclient, this.props.currentDir, file);
        this.setState({
          filepopup: {
            filename: file,
            filetype: type,
            filesize: size,
            changedtime: changed,
          },
        });
        PopupOutershellElm.fadeIn(transtion);
        PopupBoxElm.addClass("active");
      } else {
        PopupOutershellElm.fadeOut(transtion);
        PopupBoxElm.removeClass("active");
      }
      setTimeout(() => (this.handleFilePopupAction = false), 250);
    }
  };
  handleRemoveClick = (handleRenameForm) => {
    this.setState({
      modelAlert: {
        ...this.state.modelAlert,
        controlls: ["close"],
        title: "Remove File",
        content:
          "do you want to remove this file. because it removed it forever and didn't restore it.",
        submitBtnTitle: "Remove",
        onSubimtClick: () => {
          this.props.Wsclient.send(
            JSON.stringify({
              topic: "RemoveFiles",
              filenames: [
                this.props.currentDir + this.state.filepopup.filename,
              ],
            })
          );
          this.handleFilePopup(null, "hide");
          handleRenameForm(false);
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
    ShowModelAlert("div#main-body");
  };
  render() {
    return (
      <div id="main-body">
        <ModalAlert {...this.state.modelAlert} />
        <FilePopup
          data={{ ...this.state.filepopup, ...this.props.fileProps }}
          close={this.handleFilePopup}
          Wsclient={this.props.Wsclient}
          currentDir={this.props.currentDir}
          handleRemoveClick={this.handleRemoveClick}
          downloadFiles={this.props.downloadFiles}
          windowsResolution={this.props.windowsResolution}
        />
        <DirTable
          onFileClick={this.handleFilePopup}
          updateDirTableFileSelect={this.props.updateDirTableFileSelect}
          DirTableFileSelect={this.props.DirTableFileSelect}
          changeDir={this.props.changeDir}
          windowsResolution={this.props.windowsResolution}
        />
      </div>
    );
  }
}
