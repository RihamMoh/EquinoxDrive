import React from "react";
import { useContext } from "react";
import { Wsclient } from "../../../common/Wsconnection";
import prettyBytes from "pretty-bytes";
import moment from "moment/moment";
import "../../../stylesheets/home/DirTable.css";
import $ from "jquery";

const Tablecols = ["Name", "Type", "Size", "Changed", "Option"];
export const retriveTable = (Wsclient, currentDir) => {
  Wsclient.send(
    JSON.stringify({ topic: "RetriveTable", currentDir: currentDir })
  );
};
const TableHead = ({ windowsResolution }) => {
  const TableTh = ({ classes, children, style }) => {
    return (
      <th className={" p-2 fw-bold " + classes} style={style}>
        {children}
      </th>
    );
  };
  return (
    <thead id="dir-table-head" className="fs-6 sticky-top">
      <tr key={0}>
        {Tablecols.map((col) => {
          if (col === "Name") {
            return (
              <TableTh
                key={`thead-${col}`}
                classes={"ps-2"}
                style={{
                  width: "auto",
                }}
              >
                <span className="ps-4">{col}</span>
              </TableTh>
            );
          } else if (col === "Type") {
            if (["xsm"].includes(windowsResolution.widthStatus)) return false;
            return (
              <TableTh
                key={`thead-${col}`}
                classes={"ps-2"}
                style={{ width: "90px" }}
              >
                {col}
              </TableTh>
            );
          } else if (col === "Size")
            return (
              <TableTh
                key={`thead-${col}`}
                classes={"ps-2"}
                style={{ width: "75px" }}
              >
                {col}
              </TableTh>
            );
          else if (col === "Changed") {
            if (["sm", "xsm"].includes(windowsResolution.widthStatus))
              return false;
            return (
              <TableTh
                key={`thead-${col}`}
                classes={"ps-2"}
                style={{ width: "160px" }}
              >
                {col}
              </TableTh>
            );
          } else if (col === "Option")
            return (
              <TableTh
                key={`thead-${col}`}
                classes={"ps-2"}
                style={{ width: "35px" }}
              ></TableTh>
            );
          return (
            <th
              className={"p-2 fw-bold " + (col === "Name" ? " ps-4 " : "")}
              key={`thead-${col}`}
            >
              {col}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
const TableBody = ({
  tableFiles,
  onFileClick,
  updateDirTableFileSelect,
  DirTableFileSelect,
  handleDirDoubleClick,
  windowsResolution,
}) => {
  const TableFilesLoading = () => {
    let table = [];
    for (let row = 0; row < 5; row++) {
      table.push(
        <tr key={`tbody-${row}`} className="">
          <td className="p-1 placeholder-glow" key={`tobdy-row${row}-col1`}>
            <span className="placeholder col-9 "></span>
          </td>
          {!["xsm"].includes(windowsResolution.widthStatus) ? (
            <td className="p-1 placeholder-glow" key={`tobdy-row${row}-col2`}>
              <span className="placeholder col-7 "></span>
            </td>
          ) : (
            ""
          )}
          <td className="p-1 placeholder-glow" key={`tobdy-row${row}-col3`}>
            <span className="placeholder col-6 "></span>
          </td>
          {!["sm", "xsm"].includes(windowsResolution.widthStatus) ? (
            <td className="p-1 placeholder-glow" key={`tobdy-row${row}-col4`}>
              <span className="placeholder col-8 "></span>
            </td>
          ) : (
            ""
          )}
          <td></td>
        </tr>
      );
    }
    return table.map((row) => row);
  };
  const TableFilesShow = () => {
    return [
      ...tableFiles.filter(({ type }) => type === "dir"),
      ...tableFiles.filter(({ type }) => type !== "dir"),
    ].map((row, rowindex) => {
      const handleSelectCheckBox = (evt, id) => {
        updateDirTableFileSelect(
          evt.target.checked ? "add" : "remove",
          id,
          row
        );
        $(`#tbody-${rowindex}`).toggleClass("active");
      };
      const inputId = `tbody-row${rowindex}-col-0`;
      const fileRowClick = () => {
        if (row.type === "dir") return handleDirDoubleClick(row.file);
        else return;
      };
      const TableTd = ({ children, classes = "", style }) => {
        return (
          <td className={" p-1 " + classes} style={style}>
            {children}
          </td>
        );
      };
      return (
        <tr
          key={`tbody-${rowindex}`}
          id={`tbody-${rowindex}`}
          className={"" + (DirTableFileSelect[inputId] ? "active" : "")}
          onDoubleClick={fileRowClick}
          onTouchEnd={fileRowClick}
        >
          {Object.entries(row).map(([key, val], colindex) => {
            if (key === "file") {
              return (
                <TableTd
                  key={`tbody-row${rowindex}-col${colindex}`}
                  classes={"d-flex flex-row"}
                >
                  <span className="select-row d-table mx-2">
                    <input
                      className={
                        "form-check-input cursor-pointer" +
                        (Object.keys(DirTableFileSelect).length > 0
                          ? " tmp-active "
                          : "")
                      }
                      type="checkbox"
                      id={inputId}
                      key={inputId}
                      value=""
                      checked={DirTableFileSelect[inputId] ? true : false}
                      onChange={(evt) => handleSelectCheckBox(evt, inputId)}
                    />
                  </span>
                  <span className="text">{val}</span>
                </TableTd>
              );
            } else if (key === "type") {
              if (["xsm"].includes(windowsResolution.widthStatus)) return false;
              return (
                <TableTd key={`tbody-row${rowindex}-col${colindex}`}>
                  {val}
                </TableTd>
              );
            } else if (key === "size") {
              return (
                <TableTd key={`tbody-row${rowindex}-col${colindex}`}>
                  {row.type !== "dir"
                    ? prettyBytes(val, {
                        maximumFractionDigits: 2,
                        space: true,
                      })
                    : ""}
                </TableTd>
              );
            } else if (key === "changed") {
              if (["sm", "xsm"].includes(windowsResolution.widthStatus))
                return false;
              return (
                <TableTd key={`tbody-row${rowindex}-col${colindex}`}>
                  {moment(val).format("MM/DD/YYYY hh:mm a")}
                </TableTd>
              );
            } else {
              return (
                <TableTd key={`tbody-row${rowindex}-col${colindex}`}>
                  {val}
                </TableTd>
              );
            }
          })}
          <TableTd key={`tbody-row${rowindex}-col4`} classes="file-properties">
            <i
              className="bi bi-three-dots fs-5 pe-1 cursor-pointer"
              onClick={(evt) => onFileClick(evt, "show", row)}
            ></i>
          </TableTd>
        </tr>
      );
    });
  };
  return (
    <tbody
      id="dir-table-body"
      className="border border-secondary-subtle border-top-0 border-bottom-0"
    >
      {tableFiles ? TableFilesShow() : TableFilesLoading()}
    </tbody>
  );
};

export const DirTable = ({
  onFileClick,
  updateDirTableFileSelect,
  DirTableFileSelect,
  changeDir,
  windowsResolution,
}) => {
  const { data } = useContext(Wsclient);
  const handleDirDoubleClick = (clickedDir) => {
    changeDir(data.currentDir + clickedDir + "/");
  };
  return (
    <div id="scroll">
      <table id="container">
        <TableHead windowsResolution={windowsResolution} />
        <TableBody
          tableFiles={data.dirTableFiles}
          onFileClick={onFileClick}
          updateDirTableFileSelect={updateDirTableFileSelect}
          DirTableFileSelect={DirTableFileSelect}
          handleDirDoubleClick={handleDirDoubleClick}
          windowsResolution={windowsResolution}
        />
      </table>
    </div>
  );
};
