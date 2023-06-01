import { retriveTable } from "../../components/home/Body/DirTable";

export const WsStartProcess = (Wsclient, getStateData) => {
  const { currentDir } = getStateData();
  Wsclient.send(JSON.stringify({ topic: "GetBasicDirData" }));
  retriveTable(Wsclient, currentDir);
};
