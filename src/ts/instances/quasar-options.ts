import {Notify, Loading} from 'quasar';
import type {QuasarPluginOptions} from 'quasar/dist/types/plugin';

export function getQuasarOptions(): Partial<QuasarPluginOptions> {
  Notify.setDefaults({
    position: 'top-right',
    textColor: 'white',
    actions: [
      {
        icon: 'close',
        color: 'white',
      },
    ],
  });
  return {
    plugins: {Notify, Loading},
  };
}
