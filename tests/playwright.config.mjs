import {defineConfig} from '@playwright/test';
import {fileURLToPath} from 'node:url';

export default defineConfig({
 testDir:'./e2e',
 outputDir:'../test-results',
 use:{baseURL:'http://127.0.0.1:8000',reducedMotion:'reduce'},
 webServer:{
  command:'python3 -m http.server 8000 --bind 127.0.0.1',
  cwd:fileURLToPath(new URL('../',import.meta.url)),
  url:'http://127.0.0.1:8000',
  reuseExistingServer:!process.env.CI
 },
 projects:[{name:'chromium',use:{browserName:'chromium'}}]
});
