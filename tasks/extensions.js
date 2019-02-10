/***********************************************
 * This is a task to cross-build our extensions
 * from 'one' common source code
 */

const fs = require("fs-extra");
const doZip = require("./zip.js");
const log = require("./colored-console.js");
var pkg = require(process.cwd() + "/package.json");
const extPath = process.cwd() + "/extensions";

function rmCommonManifests() {
  ["Chrome", "Firefox"].forEach(function(dir) {
    fs.removeSync(`${extPath}/${dir}/manifest.core.json`);
    fs.removeSync(`${extPath}/${dir}/manifest.chrome.json`);
    fs.removeSync(`${extPath}/${dir}/manifest.firefox.json`);
  });
}

function copyCommonStatic() {
  ["Chrome", "Firefox"].forEach(function(dir) {
    fs.copySync(`${extPath}/common`, `${extPath}/${dir}`);
  });
}

function parseJSONfile(filename) {
  var jsonfile = extPath + "/common/" + filename;
  var obj = {};

  try {
    obj = JSON.parse(fs.readFileSync(jsonfile, "utf8"));
  } catch (e) {
    log.error("Error in file: " + jsonfile);
    log.dir(e + "\n");
  }

  return obj;
}

function combine(obj1, obj2, dest) {
  var finalObj = Object.assign({}, obj1, obj2);
  var fileContents = JSON.stringify(finalObj, null, 2);
  fs.writeFileSync(extPath + "/" + dest + "/manifest.json", fileContents);
}

function copyScript() {
  ["Chrome", "Firefox"].forEach(function(dir) {
    fs.copySync(
      process.cwd() + "/build/dubplus.js",
      `${extPath}/${dir}/scripts/dubplus.js`
    );
    fs.copySync(
      process.cwd() + "/build/dubplus.min.js",
      `${extPath}/${dir}/scripts/dubplus.min.js`
    );
  });
}

function copyCSS() {
  ["Chrome", "Firefox"].forEach(function(dir) {
    fs.copySync(
      process.cwd() + "/css/dubplus.css",
      `${extPath}/${dir}/css/dubplus.css`
    );
    fs.copySync(
      process.cwd() + "/css/dubplus.min.css",
      `${extPath}/${dir}/css/dubplus.min.css`
    );
  });
}
__dirname;

function build(shouldZip) {
  /***********************************************
   * Create our Chrome and Firefox folders if they
   * don't exist already
   */
  ["Chrome", "Firefox"].forEach(function(dir) {
    fs.ensureDirSync(`${extPath}/${dir}`);
  });

  /**********************************************
   * First, copy static files from common into
   * both the Chrome and Firefox folder
   */

  console.log("Copying /common to /Chrome and /Firefox)");
  copyCommonStatic();

  /**********************************************
   * Make Manifest.json for each browser
   */

  console.log("Parsing manifest files and building to appropriate folder");
  var mCore = parseJSONfile("manifest.core.json");
  var mChrome = parseJSONfile("manifest.chrome.json");
  var mFF = parseJSONfile("manifest.firefox.json");

  // set version number from package.json
  mCore.version = pkg.version;

  // combine and export manifest files
  combine(mCore, mChrome, "Chrome");
  combine(mCore, mFF, "Firefox");

  // remove the common manifests from each folder
  rmCommonManifests();

  // just in case, copy the Dubplus script and css to each extension folder
  copyScript();
  copyCSS();

  if (shouldZip) {
    doZip("Chrome");
    doZip("Firefox");
  }
}

function plugin() {
  return {
    name: "extension", // this name will show up in warnings and errors
    writeBundle() {
      build();
    }
  };
}

module.exports = {
  build: build,
  plugin: plugin
};

if (require.main === module) {
  build();
}
