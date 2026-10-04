import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5176',
    headless: false,
    viewport: { width: 1280, height: 720 },
    video: 'on',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  outputDir: 'e2e/videos',
})
