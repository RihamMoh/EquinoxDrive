import { createContext, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { retriveTable } from "../components/home/Body/DirTable";

export const Wsclient = createContext(null);
export const WsConnect = (
  setclient,
  setdata,
  startprocess,
  getStateData,
  refreshDirTable,
  genarateNotification
) => {
  const client = new W3CWebSocket("ws://192.168.1.5:9999");
  const setWsClient = () =>
    setclient(client, client.readyState !== client.CLOSED ? 1 : 0);
  client.onopen = () => {
    console.log("WebSocket Client Connected");
    startprocess(client, getStateData);
    setWsClient();
  };
  client.onmessage = (message) => {
    try {
      const retrivedMsg = JSON.parse(message.data);
      const { topic } = retrivedMsg;
      if (topic == "GetBasicDirDataReply")
        setdata({ BasicData: retrivedMsg.data });
      else if (topic === "RetriveTableReply")
        if (retrivedMsg.error) genarateNotification("error", retrivedMsg.error);
        else
          setdata({
            dirTableFiles: retrivedMsg.data.data,
            currentDir: retrivedMsg.data.data
              ? retrivedMsg.data.currentDir
              : getStateData().currentDir,
          });
      else if (topic === "RetriveFileDetailsReply") {
        if (retrivedMsg.error) genarateNotification("error", retrivedMsg.error);
        else setdata({ fileProps: retrivedMsg.data });
      } else if (topic === "RenameFileReply") {
        if (retrivedMsg.error) genarateNotification("error", retrivedMsg.error);
        else {
          if (retrivedMsg.data.success)
            genarateNotification("success", retrivedMsg.data.success);
          refreshDirTable();
        }
      } else if (topic === "RemoveFilesReply") {
        if (retrivedMsg.error) genarateNotification("error", retrivedMsg.error);
        else {
          if (retrivedMsg.data.success)
            genarateNotification("success", retrivedMsg.data.success);
          refreshDirTable();
        }
      } else if (topic === "MakeDirReply") {
        if (retrivedMsg.error) genarateNotification("error", retrivedMsg.error);
        else {
          if (retrivedMsg.data.success)
            genarateNotification("success", retrivedMsg.data.success);
          refreshDirTable();
        }
      } else
        genarateNotification(
          "info",
          "There is an unknown WS message detected."
        );
    } catch {
      genarateNotification(
        "info",
        "There is an error occur while responsing to WS msg."
      );
    }
  };
  client.onclose = () => {
    console.log("webshocket closed");
    setWsClient();
    setTimeout(() => {
      WsConnect(
        setclient,
        setdata,
        startprocess,
        getStateData,
        refreshDirTable,
        genarateNotification
      );
    }, 5000);
  };
  client.onerror = (err) => {
    console.log(err);
  };
};
