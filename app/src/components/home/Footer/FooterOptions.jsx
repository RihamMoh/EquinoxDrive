import React from "react";
import $ from "jquery";
import { DownloadUploadArea } from "./DownloadUploadArea";
import { NotificationArea } from "./NotificationArea";

// DownloadUploadArea Options are below
const handleDownloadUploadArea = (
  evt,
  toggle = "hide",
  resetProgressHistoryCount
) => {
  const transition = Number(
    $(":root")
      .css("--download-upload-area-transition")
      .slice(0, $(":root").css("--download-upload-area-transition").length - 2)
  );
  const downloadUploadArea = $("div#download-upload-area");
  const scrollBody = $("div#download-upload-area > div#body");
  if (toggle === "show") {
    resetProgressHistoryCount();
    downloadUploadArea.fadeIn(transition).addClass("show d-flex");
  } else {
    scrollBody.scrollTop(0);
    downloadUploadArea.removeClass("show d-flex").fadeOut(transition);
  }
};
export const DownloadUploadOption = ({
  progressHistory,
  windowsResolution,
  resetProgressHistoryCount,
}) => {
  return (
    <div
      className="option position-relative"
      id="download-upload-details"
      tabIndex={0}
      onBlur={(evt) => handleDownloadUploadArea(evt, "hide")}
    >
      <DownloadUploadArea
        close={handleDownloadUploadArea}
        progressHistory={progressHistory}
        windowsResolution={windowsResolution}
      />
      <div className="position-relative px-2">
        {progressHistory.newProgressCount > 0 ? (
          <span
            id="download-upload-area-new-messages"
            className="icon-message-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: 10 }}
          >
            {progressHistory.newProgressCount}
            <span className="visually-hidden">unread messages</span>
          </span>
        ) : (
          ""
        )}
        <i
          className="bi bi-arrow-left-right cursor-pointer"
          style={{ WebkitTextStroke: 0.5 }}
          onClick={(evt) =>
            handleDownloadUploadArea(evt, "show", resetProgressHistoryCount)
          }
        ></i>
      </div>
    </div>
  );
};
// Notification Options functions are below
const handleNotificationArea = (
  evt,
  toggle = "hide",
  resetNotificationHistoryCount
) => {
  const transition = Number(
    $(":root")
      .css("--notification-area-transition")
      .slice(0, $(":root").css("--notification-area-transition").length - 2)
  );
  const notificationArea = $("div#notification-area");
  const scrollBody = $("div#notification-area > div#body");
  if (toggle === "show") {
    resetNotificationHistoryCount();
    notificationArea.fadeIn(transition).addClass("show d-flex");
  } else {
    scrollBody.scrollTop(0);
    notificationArea.removeClass("show d-flex").fadeOut(transition);
  }
};
export const NotificationOption = ({
  windowsResolution,
  notificationsHistory,
  resetNotificationHistoryCount,
  setNotifications,
}) => {
  const removeNotification = (notificationUUIDS) => {
    let cpNotifications = { ...notificationsHistory.notifications };
    notificationUUIDS.forEach((notificationUUID) => {
      delete cpNotifications[notificationUUID];
    });
    setNotifications(cpNotifications);
  };
  return (
    <div
      className="option position-relative"
      id="notifications"
      tabIndex={0}
      onBlur={(evt) => handleNotificationArea(evt, "hide")}
    >
      <NotificationArea
        close={handleNotificationArea}
        windowsResolution={windowsResolution}
        notificationsHistory={notificationsHistory}
        removeNotification={removeNotification}
      />
      <div className="position-relative px-2">
        {notificationsHistory.newNotificationsCount > 0 ? (
          <span
            id="download-upload-area-new-messages"
            className="icon-message-count position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: 10 }}
          >
            {notificationsHistory.newNotificationsCount}
            <span className="visually-hidden">unread messages</span>
          </span>
        ) : (
          ""
        )}
        <i
          className="bi bi-bell cursor-pointer"
          style={{ WebkitTextStroke: 0.5 }}
          onClick={(evt) =>
            handleNotificationArea(evt, "show", resetNotificationHistoryCount)
          }
        ></i>
      </div>
    </div>
  );
};
