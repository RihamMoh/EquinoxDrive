export const getCompresedFullPath = (fullPath, widthStatus) => {
  let path;
  const limit =
    widthStatus === "xxxl"
      ? 125
      : widthStatus === "xxl"
      ? 85
      : widthStatus === "xl"
      ? 55
      : widthStatus === "l"
      ? 38
      : widthStatus === "sm"
      ? 31
      : widthStatus === "xsm"
      ? 20
      : 20;
  const folders = fullPath.split("/").filter((folder) => folder !== "");
  if (fullPath.length <= limit) return fullPath;
  else {
    let cpfolders = [...folders];
    path = `/${cpfolders.join("/")}/`;
    while (path.length > limit) {
      if (folders.slice(1, folders.length - 1).includes(cpfolders[2])) {
        if (cpfolders[1] === "...") cpfolders.splice(2, 1);
        cpfolders[1] = "...";
      } else if (cpfolders[0] === folders[0]) cpfolders.splice(0, 1);
      else {
        cpfolders[cpfolders.length - 1] =
          cpfolders[cpfolders.length - 1].slice(0, limit - 9) + "...";
      }
      path = `/${cpfolders.join("/")}/`;
    }
  }
  return path;
};
export const getWindowStatus = ({ width, height }) => {
  if (width)
    return width < 450
      ? "xsm"
      : width < 600
      ? "sm"
      : width < 750
      ? "l"
      : width < 1000
      ? "xl"
      : width < 1400
      ? "xxl"
      : "xxxl";
};
export const getCompresedFileName = (fileName, maxFileLength) => {
  return fileName && fileName.length > 3
    ? fileName.length > maxFileLength
      ? fileName.slice(0, maxFileLength - 3) + "..."
      : fileName
    : fileName;
};
