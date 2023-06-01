import React from "react";
import "../../../stylesheets/home/FilePopup.css";
import $ from "jquery";
import prettyBytes from "pretty-bytes";
import moment from "moment/moment";
import { useState } from "react";
import { PopupProperties, PopupRenameForm } from "./FilePopupTabs";

export const FileProperties = (Wsclient, currentDir, file) => {
  Wsclient.send(
    JSON.stringify({ topic: "RetriveFileDetails", filepath: currentDir + file })
  );
};
export const FilePopup = ({
  data,
  close,
  Wsclient,
  currentDir,
  handleRemoveClick,
  downloadFiles,
  windowsResolution,
}) => {
  const {
    file,
    filename,
    filetype,
    location,
    filesize,
    createdtime,
    changedtime,
    accessedtime,
    Attr,
  } = data;
  const properties = {
    Type: filetype,
    Location: location,
    Size: Number(filesize)
      ? prettyBytes(filesize, {
          maximumFractionDigits: 2,
          space: true,
        })
      : "Unknown",
    Created: Number(createdtime)
      ? moment(createdtime).format("MM/DD/YYYY hh:mm a")
      : "Unknown",
    Modified: Number(changedtime)
      ? moment(changedtime).format("MM/DD/YYYY hh:mm a")
      : "Unknown",
    Accessed: Number(accessedtime)
      ? moment(accessedtime).format("MM/DD/YYYY hh:mm a")
      : "Unknown",
  };
  const [RenameState, setRenameState] = useState({
    val: "",
    help: null,
    err: false,
  });
  const handleRenameForm = (change) => {
    if (change) {
      setRenameState({
        ...setRenameState,
        val: filename,
        help: "Makesure newname is not same as the previous name.",
        err: false,
      });
      $("div#properties").addClass("hide");
    } else $("div#properties").removeClass("hide");
  };
  const handleDownloadClick = (evt) => {
    downloadFiles([filename]);
    close(evt, "hide");
    handleRenameForm(false);
  };
  const RenameFormSubmit = (evt) => {
    evt.preventDefault();
    Wsclient.send(
      JSON.stringify({
        topic: "RenameFile",
        currentDir: currentDir,
        oldFilename: filename,
        newFilename: RenameState.val,
      })
    );
    close(evt, "hide");
    handleRenameForm(false);
  };
  return (
    <div
      id="outershell"
      onClick={(evt) => {
        if (evt.target == $("div#outershell")[0]) {
          close(evt, "hide");
          handleRenameForm(false);
        }
      }}
    >
      <div
        id="popupbox"
        className="px-4 overflow-hidden d-flex flex-column"
        style={{
          width: ["l", "sm", "xl"].includes(windowsResolution.widthStatus)
            ? "75vw"
            : ["xsm"].includes(windowsResolution.widthStatus)
            ? "80vw"
            : "60vw",
        }}
      >
        <div id="popup-nav" className="d-flex justify-content-between  py-3">
          <span className="filename fs-5 me-3 overflow-hidden text-nowrap text-truncate">
            {filename}
          </span>
          <i
            className="bi bi-x fs-2"
            onClick={(evt) => {
              close(evt, "hide");
              handleRenameForm(false);
            }}
          ></i>
        </div>
        <div className="popup-options border-2 border-bottom border-dark-subtle pb-2">
          <i
            className="bi bi-trash px-2 me-1 cursor-pointer"
            onClick={() => handleRemoveClick(handleRenameForm)}
          ></i>
          <i
            className="bi bi-download px-2 py-1 me-1 cursor-pointer"
            onClick={(evt) => handleDownloadClick(evt)}
          ></i>
          <svg
            className="mx-2 my-1 me-3 cursor-pointer"
            width="16"
            height="16"
            viewBox="0 0 1024 1024"
            version="1.1"
            onClick={() => handleRenameForm(true)}
          >
            <path d="M544 768l-384 0C142.336 768 128 753.664 128 736l0-384C128 334.336 142.336 320 160 320l384 0C561.664 320 576 334.336 576 352S561.664 384 544 384L192 384l0 320 352 0C561.664 704 576 718.336 576 736S561.664 768 544 768zM288 512C270.336 512 256 526.336 256 544S270.336 576 288 576l192 0C497.664 576 512 561.664 512 544S497.664 512 480 512L288 512zM800 896 704 896 704 192l96 0C817.664 192 832 177.664 832 160S817.664 128 800 128l-256 0C526.336 128 512 142.336 512 160S526.336 192 544 192L640 192l0 704L544 896C526.336 896 512 910.336 512 928S526.336 960 544 960l256 0c17.664 0 32-14.336 32-32S817.664 896 800 896zM864 320l-64 0C782.336 320 768 334.336 768 352S782.336 384 800 384L832 384l0 320-32 0c-17.664 0-32 14.336-32 32s14.336 32 32 32l64 0c17.664 0 32-14.336 32-32l0-384C896 334.336 881.664 320 864 320z"></path>
          </svg>
        </div>
        <div className="Body d-flex align-items-center flex-row my-3">
          <PopupProperties properties={properties} isFile={file} />
          <PopupRenameForm
            setRenameState={setRenameState}
            filename={filename}
            RenameState={RenameState}
            ifFile={file}
            changeToRenameForm={handleRenameForm}
            onRenameSubmit={RenameFormSubmit}
          />
        </div>
      </div>
    </div>
  );
};
