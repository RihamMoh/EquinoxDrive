const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");
const mime = require("mime-types");

const RetriveFiles = (location) => {
  let retrivedFiles = [];
  fs.readdirSync(location).forEach((file) => {
    filePath = location + file;
    const { size, ctimeMs } = fs.statSync(filePath);
    retrivedFiles.push({
      file: file,
      type: fs.statSync(filePath).isFile()
        ? !mime.lookup(file)
          ? "file"
          : mime.lookup(file).split("/")[0]
        : "dir",
      size: size,
      changed: ctimeMs,
    });
  });
  return retrivedFiles;
};
const RetriveFileDetails = (location, file) => {
  const filename = location + file;
  if (!location || !file || !fs.existsSync(filename)) return 0;
  const stats = fs.statSync(filename);
  let data = {
    createdtime: stats.birthtimeMs,
    Attr: { hidden: file[1] == "." },
    location: location + file,
  };
  if (stats.isFile())
    data = {
      ...data,
      accessedtime: stats.atimeMs,
      modifiedtime: stats.mtimeMs,
      file: true,
    };
  else if (stats.isDirectory()) data = { ...data, file: false };
  return data;
};
module.exports = { RetriveFiles, RetriveFileDetails };
