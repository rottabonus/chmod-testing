const fs = require("fs/promises");
const path = require("path");
const childProcess = require("child_process");

const changePermissions = (filepath, permissions) =>
  fs.chmod(filepath, permissions);

const checkAccess = async (filepath) => {
  try {
    await fs.access(filepath, fs.constants.W_OK);
    console.log("has access!");
  } catch (error) {
    console.log("no access!", error);
  }
};

const lsAll = (filePath) =>
  new Promise((resolve) =>
    childProcess.exec(`ls -l ./${filePath}`, (error, response) => {
      if (error) {
        console.log("error reading", error);
        resolve(error);
      }

      console.log(response);
      resolve(response);
    })
  );

const dirName = "foo";
const dir = path.join(dirName);
const readPermission = "4444";

const main = async () => {
  console.log("create dir");
  await fs.mkdir(dir);

  console.log("write file to dir");
  const fileName = path.join(dir, "bar");
  await fs.writeFile(fileName, "baz");

  console.log(`change permissions to read-only (${readPermission}):`);
  await changePermissions(dir, readPermission);

  console.log("check access:");
  await checkAccess(dir);
  await lsAll(dir);

  console.log("try to delete file from folder");
  try {
    await fs.rm(fileName);
  } catch (error) {
    console.log("error", error);
  }

  try {
    await fs.rm(dir, { force: true, recursive: true });
    console.log("deleted the dir");
  } catch (error) {
    if (error.code === "EACCES") {
      console.log("cannot remove, no permission");
      await changePermissions(dir, "7777");
      await fs.rm(dir, { force: true, recursive: true });
      console.log("changed permission to write and deleted");
    }
  }
  console.log("done");
};

main();
