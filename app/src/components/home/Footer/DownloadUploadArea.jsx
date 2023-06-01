import React from "react";
import "../../../stylesheets/home/DownloadUploadArea.css";

const DownloadUploadRecord = ({
  fileName,
  fileStatus,
  transferMethod,
  progressValue,
  cancelDownload,
  index,
}) => {
  return (
    <div
      id={"progress" + fileName}
      key={fileName + index}
      className="d-flex flex-row align-items-center py-1"
    >
      <div className="icon">
        {transferMethod === "download" ? (
          <i
            className={
              "bi bi-file-earmark-arrow-down fs-3 mx-3 text-primary " +
              (progressValue === 100 ? "text-success" : "")
            }
          ></i>
        ) : (
          <i
            className={
              "bi bi-file-earmark-arrow-up fs-3 mx-3 text-primary " +
              (progressValue === 100 ? "text-success" : "")
            }
          ></i>
        )}
      </div>
      <div id="file-container">
        <div className="filename text">
          {fileName.length > 20 ? fileName.slice(0, 20) + "..." : fileName}
        </div>
        {progressValue !== 100 ? (
          <div
            id="progressBar"
            className="progress"
            role="progressbar"
            area-valuenow={progressValue}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="progress-bar bg-red"
              style={{
                width: progressValue + "%",
              }}
            ></div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div id="cancel-download" className="px-2">
        {progressValue !== 100 ? (
          <div className="icon">
            <i
              className="bi bi-x-circle-fill text-secondary cursor-pointer"
              onClick={cancelDownload}
            ></i>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
export const DownloadUploadArea = ({
  progressHistory,
  close,
  windowsResolution,
}) => {
  return (
    <div
      id="download-upload-area"
      className={
        (windowsResolution.widthStatus === "xsm" ? " fit-to-screen " : "") +
        "shadow bg-body-tertiary rounded flex-column overflow-hidden"
      }
    >
      <div
        id="controllbar"
        className="d-flex flex-row align-items-center justify-content-between py-2 border-2 border-bottom border-secondary-subtle"
      >
        <strong id="controllbartitle" className="text ms-3">
          Downloads And Uploads
        </strong>
        <i
          className="bi bi-x me-3 fs-4 cursor-pointer"
          style={{ WebkitTextStroke: 1 }}
          onClick={(evt) => close(evt, "hide")}
        ></i>
      </div>
      <div id="body" className="overflow-auto my-1 me-1">
        {Object.keys(progressHistory.progress).length === 0 ? (
          <div
            id="NoHistory"
            className="d-flex align-items-center justify-content-center"
          >
            <span className="text py-2">No Downloads/Uploads</span>
          </div>
        ) : (
          Object.entries(progressHistory.progress)
            .reverse()
            .map(
              (
                [filename, { filestatus, transfermethod, progressVal, cancel }],
                index
              ) => {
                return (
                  <DownloadUploadRecord
                    fileName={filename}
                    fileStatus={filestatus}
                    transferMethod={transfermethod}
                    progressValue={progressVal}
                    index={index}
                    key={filename + index}
                    cancelDownload={cancel}
                  />
                );
              }
            )
        )}
      </div>
    </div>
  );
};
