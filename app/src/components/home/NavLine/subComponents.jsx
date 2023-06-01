import React from "react";
import { useState } from "react";

export const MakeDirModelAlertBody = ({
  inputId,
  defaultFolderName,
  dirTableFiles,
  setModelAlert,
}) => {
  const getDefaultFolderName = () => {
    try {
      let count = 1;
      while (true) {
        if (
          !dirTableFiles
            .map(({ file }) => file)
            .includes(String(defaultFolderName + String(count)))
        )
          return defaultFolderName + String(count);
        count = count + 1;
      }
    } catch {
      return "";
    }
  };
  const [InpVal, setInpVal] = useState(getDefaultFolderName());
  const [Error, setError] = useState("");
  const onDirFileNameInputChange = (value) => {
    if (
      value.includes("/") ||
      value.includes("\\") ||
      value.includes(" ") ||
      dirTableFiles
        .filter(({ type }) => type === "dir")
        .map(({ file }) => file)
        .includes(value) ||
      value === ""
    ) {
      setError("Please remove all spaces and slashes in the name.");
      setModelAlert({ disabled: true });
    } else {
      setError("");
      setModelAlert({ disabled: false });
    }
    setInpVal(value);
  };
  return (
    <React.Fragment>
      <label
        htmlFor="dir-filename-input"
        className="form-label  d-flex flex-column text-dark fs-sm"
      >
        New Folder
      </label>
      <input
        id={inputId}
        type="text"
        className="form-control"
        onChange={(evt) => onDirFileNameInputChange(evt.target.value)}
        value={InpVal}
      />
      <span className="text text-danger form-text fs-xsm">{Error}</span>
    </React.Fragment>
  );
};
