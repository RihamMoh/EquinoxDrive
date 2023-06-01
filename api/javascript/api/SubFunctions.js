const getCompresedFileName = (fileName, maxFileLength) => {
  return fileName && fileName.length > 3
    ? fileName.length > maxFileLength
      ? fileName.slice(0, maxFileLength - 3) + "..."
      : fileName
    : fileName;
};
module.exports = { getCompresedFileName };
