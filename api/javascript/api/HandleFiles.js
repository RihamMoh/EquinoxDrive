const fs = require("fs");
const { rootDir } = require("../config.json");

const RenameFiles = (oldfile, newfile) => {
  if (fs.renameSync(rootDir + oldfile, rootDir + newfile)) return true;
  else return false;
};
const RemoveFiles = (files) => {
  let rcode = [];
  files.forEach((file) => {
    const isFile = fs.statSync(rootDir + file).isFile();
    if (isFile ? fs.unlinkSync(rootDir + file) : false) return true;
    else if (
      !isFile
        ? fs.rmdirSync(rootDir + file, { recursive: true, force: true })
        : false
    )
      rcode.push(true);
    rcode.push(false);
  });
  return rcode.includes(false) ? false : true;
};
const MakeNewDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    return fs.existsSync(dir);
  } else return false;
};
module.exports = { RenameFiles, RemoveFiles, MakeNewDir };
