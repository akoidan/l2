import { promises as fs, } from 'fs';
import { sep } from 'path';
import {
  ConfigData,
  rootSchema
} from '@/types';

export class ConfigReader {
  constructor() {
  }

  async pathExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }


  async getConfig(): Promise<ConfigData> {
    const config = [process.cwd(), 'config.json'].join(sep);
    if (!await this.pathExists(config)) {
      console.log(`Config ${JSON.stringify(rootSchema.describe(), null, 2)}`);
      throw Error(`Cannot read from config from '${config}'`)
    }
    console.log(`Reading config from ${config}`);
    const conf = JSON.parse(await fs.readFile(config, 'utf-8')) as ConfigData;
    console.log(`Got config ${JSON.stringify(conf, null, 2)}`);
    await rootSchema.validate(conf);
    return conf;
  }
}
