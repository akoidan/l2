export interface ElectronApi {
  registerShortcut(shortcut: string, cb: () => void): void;
  unregisterShortcut(shortcut: string): void;
  unregisterAll(): void;
}
