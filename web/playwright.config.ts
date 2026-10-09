import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 15000,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5176',
    permissions: ['clipboard-read', 'clipboard-write'],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
