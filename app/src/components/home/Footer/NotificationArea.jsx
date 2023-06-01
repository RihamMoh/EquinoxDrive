import React from "react";
import "../../../stylesheets/home/NotificationArea.css";

const Notification = ({
  notificationUUID,
  Status,
  msg,
  index,
  removeNotification,
}) => {
  return (
    <div
      id={`notification-${notificationUUID}-no-${index}`}
      className="d-flex flex-row py-1"
    >
      <div className="icon text-top">
        {Status === "success" ? (
          <i className="bi bi-check-circle-fill fs-3 mx-3 text-success"></i>
        ) : Status === "error" ? (
          <i className="bi bi-exclamation-circle-fill fs-3 mx-3 text-danger"></i>
        ) : Status === "warning" ? (
          <i className="bi bi-exclamation-triangle-fill fs-3 mx-3 text-warning"></i>
        ) : (
          <i className="bi bi-info-circle-fill fs-3 mx-3 text-info"></i>
        )}
      </div>
      <p
        id="msg-container"
        className="text-start fs-sm d-flex align-items-center m-0 mb-1 w-100"
      >
        {msg}
      </p>
      <div id="remove-notification" className="px-2 d-flex align-items-center">
        <div className="icon">
          <i
            className="bi bi-x-circle-fill text-secondary cursor-pointer"
            onClick={() => removeNotification([notificationUUID])}
          ></i>
        </div>
      </div>
    </div>
  );
};

export const NotificationArea = ({
  close,
  windowsResolution,
  notificationsHistory,
  removeNotification,
}) => {
  return (
    <div
      id="notification-area"
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
          Notifications
        </strong>
        <i
          className="bi bi-x me-3 fs-4 cursor-pointer"
          style={{ WebkitTextStroke: 1 }}
          onClick={(evt) => close(evt, "hide")}
        ></i>
      </div>
      <div id="body" className="overflow-auto my-1 me-1">
        {Object.keys(notificationsHistory.notifications).length === 0 ? (
          <div
            id="no-history"
            className="d-flex align-items-center justify-content-center"
          >
            <span className="text py-2">No Notifications</span>
          </div>
        ) : (
          <React.Fragment>
            <span
              id="clear-all"
              className="d-flex justify-content-center btn cursor-pointer btn-outline-light text-dark py-0 rounded-0 border-1 border-bottom"
              onClick={() =>
                removeNotification(
                  Object.keys(notificationsHistory.notifications)
                )
              }
            >
              <span className="text py-1 fs-sm">clear all</span>
            </span>
            {Object.entries(notificationsHistory.notifications).map(
              ([notificationUUID, { Status, msg }], index) => {
                return (
                  <Notification
                    key={`notification-${notificationUUID}-${index}-${Status}`}
                    notificationUUID={notificationUUID}
                    Status={Status}
                    msg={msg}
                    index={index}
                    removeNotification={removeNotification}
                  />
                );
              }
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
