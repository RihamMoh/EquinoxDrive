import { useContext } from "react";
import { Wsclient } from "../../../common/Wsconnection";
import { getCompresedFullPath } from "../../common";
import { DownloadUploadOption, NotificationOption } from "./FooterOptions";

const WsConnectionStatus = ({ status, windowsResolution }) => {
  return (
    <div className="pe-1 border-2 border-end border-secondary">
      <span className="mx-1">
        {["sm", "xsm"].includes(windowsResolution.widthStatus)
          ? ""
          : status
          ? "Connected"
          : "Disconnected"}
      </span>
      <span>
        <i
          className={
            "bi bi-circle-fill fs-sm " +
            (status ? "text-success" : "text-danger")
          }
        ></i>
      </span>
    </div>
  );
};

export const Footer = ({
  progressHistory,
  resetProgressHistoryCount,
  notificationsHistory,
  setNotifications,
  resetNotificationHistoryCount,
  currentDirFullPath,
  refreshDirTable,
  windowsResolution,
}) => {
  const { wsstatus, wsclient } = useContext(Wsclient);
  const currentDirCompresedPath =
    currentDirFullPath !== "undefined" && currentDirFullPath
      ? getCompresedFullPath(currentDirFullPath, windowsResolution.widthStatus)
      : undefined;
  return (
    <div
      id="footer"
      className="d-flex flex-row justify-content-between px-3 py-1 bg-f7f7f7"
    >
      <div id="footer-status" className="d-flex flex-row align-items-center">
        <WsConnectionStatus
          status={wsstatus}
          windowsResolution={windowsResolution}
        />
        <span className="ps-2">
          {currentDirCompresedPath && currentDirCompresedPath !== ""
            ? currentDirCompresedPath
            : "No connection..."}
        </span>
      </div>
      <div
        id="footerOptions"
        className="me-3 d-flex flex-row align-items-center"
      >
        <DownloadUploadOption
          progressHistory={progressHistory}
          windowsResolution={windowsResolution}
          resetProgressHistoryCount={resetProgressHistoryCount}
        />
        <NotificationOption
          notificationsHistory={notificationsHistory}
          windowsResolution={windowsResolution}
          resetNotificationHistoryCount={resetNotificationHistoryCount}
          setNotifications={setNotifications}
        />
      </div>
    </div>
  );
};
