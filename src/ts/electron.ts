import {
  app,
  globalShortcut,
  BrowserWindow
} from 'electron'
import { ConfigReader } from '@/ts/utils/config';
import { LogicRunner } from '@/ts/utils/logic-runner';
import { ElectronWrapper } from '@/ts/utils/electorn-wrapper';


export class ElectronStarter {

  private loginRunner: LogicRunner;

  constructor() {
    const electronApi  = new ElectronWrapper();
    this.loginRunner = new LogicRunner(electronApi);
  }

  async createWindow() {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
    })
    await win.loadFile('src/assets/index.html')
  }

  async start() {
    await app.whenReady();
    app.on('will-quit', () => {
      globalShortcut.unregister('Alt+1')
      globalShortcut.unregisterAll()
    });
    try {
      const configReader = new ConfigReader();
      const config = await configReader.getConfig();
      this.loginRunner.setConfig(config);
      await this.loginRunner.connect();
      await this.createWindow();
    } catch (e) {
      console.error(e);
      app.exit(1);
    }
  }
}



