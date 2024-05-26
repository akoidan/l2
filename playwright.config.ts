import { defineConfig } from '@playwright/test';
import { getPlaywrightTestConfig } from './build/playwright';

export default defineConfig(getPlaywrightTestConfig());
