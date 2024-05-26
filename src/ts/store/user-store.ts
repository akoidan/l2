import { defineStore } from 'pinia';
import { ConfigData } from '@/ts/types/config';

interface ConfigStoreState {
  config: ConfigData | null;
}

interface ConfigStoreActions {
  setConfig(config: ConfigData): void;
}

export const useConfigStore = defineStore<'config', ConfigStoreState, any, ConfigStoreActions>('config', {
  state: () => ({
    config: null,
  }),
  actions: {
    setConfig(config: ConfigData): void {
      this.config = config;
    },
  },
});
