import React from "react";
import "../../stylesheets/common/ModelAlert.css";
import $ from "jquery";
export const ShowModelAlert = (modelAlertPath) => {
  const transtion = Number(
    $(":root")
      .css("--modelAlert-transition")
      .slice(0, $(":root").css("--modelAlert-transition").length - 2)
  );
  $(`${modelAlertPath} > div#model-alert-outershell`).fadeIn(transtion);
  $(
    `${modelAlertPath} > div#model-alert-outershell > div#model-alertbox`
  ).addClass("active");
};
export const ModalAlert = (props) => {
  const {
    controlls,
    title,
    content,
    submitBtnTitle,
    onSubimtClick,
    onCloseBtnClick,
    disabled,
  } = props;
  const handleCloseBtnClick = () => {
    const transtion = Number(
      $(":root")
        .css("--modelAlert-transition")
        .slice(0, $(":root").css("--modelAlert-transition").length - 2)
    );
    $("div#model-alert-outershell").fadeOut(transtion);
    $("div#model-alert-outershell > div#model-alertbox").removeClass("active");
    onCloseBtnClick();
  };
  return (
    <div
      id="model-alert-outershell"
      onClick={(evt) => {
        if (evt.target == $("div#model-alert-outershell")[0])
          $("div#model-alert-outershell > div#model-alertbox")
            .addClass("animate")
            .on("animationend", () =>
              $("div#model-alert-outershell > div#model-alertbox").removeClass(
                "animate"
              )
            );
      }}
    >
      <div id="model-alertbox" className="py-2">
        <div
          id="navline"
          className="px-3 d-flex align-items-center justify-content-between pt-2 border-bottom border-2"
        >
          <span className="title fst-bolder">{title}</span>
          <i
            className="bi bi-x fs-2 cursor-pointer"
            onClick={handleCloseBtnClick}
          ></i>
        </div>
        <div id="content" className="px-3 pt-2">
          <p className="text text-secondary fs-6">{content}</p>
        </div>
        <div
          id="controlls"
          className="d-flex flex-row justify-content-end px-5 pb-2 border-top border-2 pt-3"
        >
          {controlls.includes("close") ? (
            <button
              id="closebtn"
              type="button"
              onClick={handleCloseBtnClick}
              className="mx-4 btn btn-secondary"
            >
              Close
            </button>
          ) : (
            ""
          )}
          <button
            id="submitbtn"
            type="submit"
            className="btn btn-primary"
            onClick={() => {
              onSubimtClick();
              handleCloseBtnClick();
            }}
            disabled={disabled}
          >
            {submitBtnTitle}
          </button>
        </div>
      </div>
    </div>
  );
};
