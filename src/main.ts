import {
  app,
  globalShortcut
} from 'electron'
import { ConfigReader } from '@/config';
import {
  ConfigCombination,
  ConfigData
} from '@/types';
import { Api } from '@/clients';


class ShortCutSender {

  private ids: Record<string, Api> = {};
  private config: ConfigData;
  private activeFighterIndex: number = 0;

  async sendKeyToApi(comb: ConfigCombination) {
    console.log(`${comb.shortCut} pressed`);
    // @ts-ignore TS7053
    const receivers: string[] = (Array.isArray(this.config.urls[comb.receiver]) ? this.config.urls[comb.receiver] : [this.config.urls[comb.receiver]]) as any as string[];
    if (comb.circular && receivers.length > 0) {
      await this.ids[`${comb.receiver}-${this.activeFighterIndex}`].sendKey(comb.keySend);
      if (this.activeFighterIndex >= receivers.length - 1) {
        this.activeFighterIndex = 0; // 3
      } else {
        this.activeFighterIndex ++;
      }
    } else {
      for (let i = 0; i < receivers.length; i++) {
        await this.ids[`${comb.receiver}-${i}`].sendKey(comb.keySend);
        await new Promise(resolve => setTimeout(resolve, Math.round(Math.random()*500)));
      }
    }
  }

  async createApi() {
    await Promise.all(Object.entries(this.config.urls).map(([key, value]) => {
      const values = Array.isArray(value) ? value : [value];
      values.map((url, index) => {
        const name = `${key}-${index}`;
        const api = new Api(url, name);
        this.ids[`${key}-${index}`] = api;
        return api.connect();
      })
    }).flatMap(a => a));
  }



  async start() {
    await app.whenReady();
    app.on('will-quit', () => {
      globalShortcut.unregister('Alt+1')
      globalShortcut.unregisterAll()
    });
    try {
      const configReader = new ConfigReader(app.getPath('userData'));
      this.config = await configReader.getConfig();
      await this.createApi();
      this.config.combinations.forEach(comb => {
        const ret = globalShortcut.register(comb.shortCut, () => {
          void this.sendKeyToApi(comb);
        })
        if (!ret) {
          console.log('registration failed')
        }
      });
    } catch (e) {
      console.error(e);
      app.exit(1);
    }

  }

}



new ShortCutSender().start();

