import React from "react";

export const PopupProperties = ({ properties, isFile }) => {
  return (
    <div id="properties">
      <h4>Properties</h4>
      <div className="popup-details py-3 px-1">
        <table className="basicprops table">
          <tbody className="body">
            {Object.entries(properties).map(([key, val], index) => {
              if (!isFile && (key == "Modified" || key == "Accessed")) return;
              return (
                <tr
                  key={`tr-${key}-${index}`}
                  className={
                    key === "Size"
                      ? "border-1 border-bottom border-dark-subtle"
                      : ""
                  }
                >
                  <td key={`${key}-1`} className="border-0">
                    {key}:
                  </td>
                  <td key={`${key}-2`} className="border-0 text-break me-3">
                    {val}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export const PopupRenameForm = ({
  setRenameState,
  filename,
  RenameState,
  isFile,
  changeToRenameForm,
  onRenameSubmit,
}) => {
  const handleRenameInput = (val) => {
    let err = false;
    let help = "Makesure newname is not same as the previous name.";
    if (
      val.includes(" ") ||
      val === "" ||
      val.includes("/") ||
      val.includes("\\")
    ) {
      help = "Remove slashes and spaces or give a name.";
      err = true;
    }
    setRenameState({ ...RenameState, val: val, help: help, err: err });
  };
  return (
    <div id="renameform">
      <h4>Rename</h4>
      <div className="rename-body py-3 px-1">
        <form onSubmit={(evt) => onRenameSubmit(evt)}>
          <div className="mb-3">
            <label htmlFor="Rename-newname-Input1" className="form-label">
              New filename
            </label>
            <input
              type="text"
              className="form-control"
              id="Rename-newname-Input1"
              value={RenameState.val}
              aria-describedby="RenameHelp"
              onChange={(evt) => handleRenameInput(evt.target.value)}
            />
            <div
              id="RenameHelp"
              className={
                RenameState.err ? "text-danger form-text" : "form-text"
              }
            >
              {RenameState.help}
            </div>
          </div>
          <div className="buttonscontainer d-flex flex-row justify-content-around">
            <button
              type="submit"
              className="btn btn-primary btn-sm px-4"
              disabled={RenameState.err || filename === RenameState.val}
            >
              Apply
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm px-4"
              onClick={() => changeToRenameForm(false)}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
