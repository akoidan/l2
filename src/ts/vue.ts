import * as constants from '@/ts/utils/consts';

import App from '@/vue/app.vue';
import { createApp } from 'vue';
import { Quasar } from 'quasar';
import type { Logger } from 'lines-logger';

import type { App as VueApp } from '@vue/runtime-core';

import { routerFactory } from '@/ts/router/router-factory';
import { loggerInstance } from '@/ts/instances/logger-instance';
import { createPinia } from 'pinia';
import { getQuasarOptions } from '@/ts/instances/quasar-options';


const logger: Logger = loggerInstance.getLoggerColor('main', '#007a70');
logger.log(`Evaluating main script ${constants.GIT_HASH}`)();


// eslint-disable-next-line max-lines-per-function, max-statements
async function init(): Promise<void> {
  // Hotfix for Edge 15 for reflect data
  if (!window.InputEvent) {
    // @ts-expect-error: next-line
    window.InputEvent = (): void => { // eslint-disable-line @typescript-eslint/no-empty-function
    };
  }

  const pinia = createPinia();
  const app: VueApp = createApp(App)
    .use(routerFactory())
    .use(pinia)
    .use(Quasar, getQuasarOptions())
  app.config.errorHandler = (err, vm, info): boolean => {
    logger.error('Error occurred in vue component err: \'{}\', vm \'{}\', info \'{}\'', err, vm, info)();
    return false;
  };

  app.mount(document.querySelector('#q-app'));

  window.onerror = function onerror(msg, url, linenumber): boolean {
    const message = `Error occurred in ${url!}:${linenumber!}\n${JSON.stringify(msg)}`;
    logger.error(message)();
    return false;
  };

  window.gitVersion = constants.GIT_HASH; // eslint-disable-line require-atomic-updates
  if (constants.IS_DEBUG) {
    window.vue = app; // eslint-disable-line require-atomic-updates
    window.consts = constants; // eslint-disable-line require-atomic-updates
    window.pinia = pinia; // eslint-disable-line require-atomic-updates
    logger.log('Constants {}', constants)();
  }
}

if (document.body) {
  void init();
} else {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  document.addEventListener('DOMContentLoaded', init);
}
