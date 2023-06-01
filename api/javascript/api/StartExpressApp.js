const fs = require("fs");
const {
  rootDir,
  downloadFileName,
  maxFileDownloadSize,
} = require("../config.json");

const AdmZip = require("adm-zip");
const uuid = require("uuid");
function startExpressApp(app) {
  app.get("/downloadfile/:currentDir/:files", (req, res, next) => {
    try {
      const files = JSON.parse(Buffer.from(req.params.files, "base64"));
      const currentDir = JSON.parse(
        Buffer.from(req.params.currentDir, "base64")
      );
      if (
        files.length > 1 ||
        (fs.statSync(rootDir + currentDir + files[0]).isFile()
          ? fs.statSync(rootDir + currentDir + files[0]).size >
            maxFileDownloadSize
          : true)
      ) {
        const zipFile = new AdmZip();
        for (const file of files) {
          const fileFullPath = rootDir + currentDir + file;
          if (!fs.existsSync(fileFullPath)) continue;
          else if (fs.statSync(fileFullPath).isFile())
            zipFile.addLocalFile(fileFullPath);
          else
            zipFile.addLocalFolder(
              fileFullPath,
              file.split("/").splice(0, file.split("/").length)[0]
            );
        }
        const outputFilename =
          files.length == 1
            ? files[0] + ".zip"
            : downloadFileName + uuid.v1() + ".zip";
        const zipData = zipFile.toBuffer();
        res.set(
          "Content-Disposition",
          `attachment; filename=${outputFilename}`
        );
        res.set("Content-Length", zipData.length);
        res.write(zipData, "binary");
        res.status(200).end("successfuly sended!.");
      } else {
        res.download(rootDir + currentDir + files[0]);
      }
    } catch (err) {
      console.log(err);
      res.status(400).end("An error occur while downlloading Files!.");
    }
  });
  app.post("/uploadfile", (req, res, next) => {
    try {
      console.log(req.files);
      const [fileName, file] = Object.entries(req.files)[0];
      const filename = file.name.replace(/ +/g, "_");
      const currentDir =
        fileName
          .split("/")
          .splice(0, fileName.split("/").length - 1)
          .join("/") + "/";
      if (filename.includes("../") || currentDir.includes("../"))
        return res
          .status(400)
          .json({ rcode: 1, err: "The file format is valid!." });
      let path = rootDir + currentDir + filename;
      if (fs.existsSync(path))
        path =
          rootDir +
          currentDir +
          filename
            .split(".")
            .splice(0, filename.split(".").length - 1)
            .join(".") + // before last extention
          uuid.v1() + // uuid
          "." +
          filename.split(".")[filename.split(".").length - 1]; // extention
      console.log(path);
      file.mv(path, (err) => {
        if (err)
          res
            .status(504)
            .json({ rcode: 1, err: "An error occur while uploading!." })
            .end();
        else
          res
            .status(200)
            .json({ rcode: 0, message: "The file is successfuly uploaded!." })
            .end();
      });
    } catch (err) {
      console.log(err);
      res
        .status(400)
        .json({ rcode: 1, err: "An error occur While uploading the File!." })
        .end();
    }
  });
}

module.exports = { startExpressApp };
