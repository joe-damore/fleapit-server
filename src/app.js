const appInfo = require('../package.json');
const AppDirectory = require('appdirectory');
const path = require('path');
const { program } = require('commander');

program
  .option('-r, --rescan', 'rescan media library')
  .option('-c, --config <path>', 'path to configuration file');

program.parse(process.argv);

const dirs = new AppDirectory({
  appName: appInfo.name,
});

const config = (() => {
  if (program.config) {
    return path.resolve(program.config);
  }
  return path.resolve(dirs.userConfig(), 'config.json');
})();

module.exports = {
  name: appInfo.name,
  version: appInfo.version,
  dirs: dirs,
  config: config,
};
