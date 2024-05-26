require('ts-node').register();
require('tsconfig-paths').register();
const {ElectronStarter} = require('./src/ts/electron');

new ElectronStarter().start();
