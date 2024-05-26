import { ElectronApi } from '@/ts/types/electron';
import {
  app,
  globalShortcut
} from 'electron'

export class ElectronWrapper implements ElectronApi {

  registerShortcut(shortCut: string, cb: () => void): void {
    const res = globalShortcut.register(shortCut, cb);
    if (!res) {
      throw new Error(`Failed to register shortcut ${shortCut}`);
    }
  }

  unregisterShortcut(shortCut: string): void {
    globalShortcut.unregister(shortCut);
  }

  unregisterAll() {
    globalShortcut.unregisterAll();
  }
}
