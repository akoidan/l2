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


async function sendKeyToApi(comb: ConfigCombination, config: ConfigData, ids: Record<string, Api>) {
  console.log(`${comb.shortCut} pressed`);
  // @ts-ignore
  const receivers: string[] = (Array.isArray(config.urls[comb.receiver]) ? config.urls[comb.receiver] : [config.urls[comb.receiver]]) as any as string[];
  for (let i = 0; i < receivers.length; i++) {
    // @ts-ignore
    await ids[`${comb.receiver}-${i}`].sendKey(comb.keySend);
    await new Promise(resolve => setTimeout(resolve, Math.round(Math.random()*100)));
  }
}

async function createApi(conf: ConfigData, ids: Record<string, Api>) {
  await Promise.all(Object.entries(conf.urls).map(([key, value]) => {
    const values = Array.isArray(value) ? value : [value];
    values.map((url, index) => {
      const name = `${key}-${index}`;
      const api = new Api(url, name);
      ids[`${key}-${index}`] = api;
      return api.connect();
    })
  }).flatMap(a => a));
}

async function start() {
  await app.whenReady();
  app.on('will-quit', () => {
    globalShortcut.unregister('Alt+1')
    globalShortcut.unregisterAll()
  });
  try {
    const configReader = new ConfigReader(app.getPath('userData'));
    const conf = await configReader.getConfig();
    const ids = {} as Record<string, Api>;
    await createApi(conf, ids);

    conf.combinations.forEach(comb => {
      const ret = globalShortcut.register(comb.shortCut, () => {
        void sendKeyToApi(comb, conf, ids);
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

start();
