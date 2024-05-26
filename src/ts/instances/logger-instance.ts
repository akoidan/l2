import { LoggerFactory } from 'lines-logger';
import { IS_DEBUG, } from '@/ts/utils/consts';

export const loggerInstance = new LoggerFactory(IS_DEBUG ? 'trace' : 'error');
