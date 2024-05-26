import type {App as VueApp} from '@vue/runtime-core';
import type {Pinia} from 'pinia';

declare global {
  interface Window {
    gitVersion?: string;
    vue: VueApp;
    consts: any;
    pinia: Pinia;
  }
}
