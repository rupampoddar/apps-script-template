/**
 * Prepares/syncs environment files
 *
 * This script gets the version number from root package.json
 * file and updates it on gas-root/.env file
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const process = require("process");
const pkg = require("../../../package.json");

const envFilePath = path.resolve(__dirname, "../.env");
const readEnvVars = () => fs.readFileSync(envFilePath, "utf-8").split(os.EOL);

const setEnvValue = (key, value) => {
  const envVars = readEnvVars();
  const targetLine = envVars.find((line) => line.split("=")[0] === key);
  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);
    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, `${key}=${value}`);
  } else {
    // create new key value
    envVars.push(`${key}=${value}`);
  }
  // write everything back to the file system
  fs.writeFileSync(envFilePath, envVars.join(os.EOL));
};

try {
  // update gas-root/.env file
  process.stdout.write("[prep.js] updating gas-root/.env file\n");
  setEnvValue(`PUBLIC_PACKAGE_VERSION`, pkg.version);
  // setEnvValue(`ENVIRONMENT`, process.env.NODE_ENV);
} catch (error) {
  process.stdout.write("[prep.js] error", error);
  process.exit(1);
}
