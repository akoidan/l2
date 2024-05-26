import { Api } from '@/ts/api/clients';
import {
  ConfigCombination,
  ConfigData,
  ConfigUrl,
  Receiver
} from '@/ts/types/config';
import { ElectronApi } from '@/ts/types/electron';

export class LogicRunner {

  private ids: Record<string, Api> = {};
  private config: ConfigData = null as any;
  private activeFighterIndex: number = 0;

  constructor(private electronApi: ElectronApi) {
  }
  async sendKeyToApi(comb: ConfigCombination ) {
    console.log(`${comb.shortCut} pressed`);

    const receivers: Receiver[] = [];
    for (const rec of comb.receivers) {
      for (const dest of this.config!.urls[rec.destination as keyof ConfigUrl]!) {
        receivers.push({
          ...rec,
          destination: dest!,
        })
      }
    }
    // const receivers: string[] = comb.receivers.map(rec => this.config.urls[rec as keyof ConfigUrl]).flatMap(a => a);
    if (comb.circular && receivers.length > 0) {
      await this.runCommand(receivers[this.activeFighterIndex]);
      if (this.activeFighterIndex >= receivers.length - 1) {
        this.activeFighterIndex = 0;
      } else {
        this.activeFighterIndex++;
      }
    } else {
      for (let i = 0; i < receivers.length; i++) {
        await this.runCommand(receivers[i]);
        await new Promise(resolve => setTimeout(resolve, Math.round(Math.random() * 500)));
      }
    }
  }

  async runCommand(currRec: Receiver) {
    if (currRec.keySend) {
      await this.ids[currRec.destination].sendKey(currRec.keySend);
    } else if (currRec.id) {
      await this.ids[currRec.destination].sendCustomKey(currRec.id, currRec.run);
    } else {
      throw Error('No keySend or id provided');
    }
  }

  async connect(): Promise<void> {
    for (const a of this.config!.combinations) {
      this.electronApi.registerShortcut(a.shortCut, () => this.sendKeyToApi(a))
    }
    await Promise.all(Object.entries(this.config.urls!).map(([key, value]) => {
      const values: string[] = (Array.isArray(value) ? value : [value]) as string[];
      values.map((url, index) => {
        const api = new Api(url, `${key}-${index}`);
        this.ids[url] = api;
        return api.connect();
      })
    }).flatMap(a => a));
  }

  disconnect(): void {
    this.electronApi.unregisterAll();
  }

  setConfig(config: ConfigData): void {
    this.config = config;
  }

}
