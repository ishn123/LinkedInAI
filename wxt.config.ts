import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest:{
    web_accessible_resources: [
      {
        resources: [// The exact resource
          'assets/*'                 // Or wildcard for all assets
        ],
        matches: ['https://*.linkedin.com/*'],  // Define the domains that can access the resources
      }
    ],
  }
});
