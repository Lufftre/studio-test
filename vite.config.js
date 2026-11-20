import { defineConfig } from 'vite';

// Allow the Open Source Cloud (osaas.io) deploy hostnames. The leading dot
// matches any subdomain, so redeploys with a new generated name keep working.
const allowedHosts = ['.auto.prod-se.osaas.io'];

export default defineConfig({
  server: { host: true, allowedHosts },
  preview: { host: true, allowedHosts },
});
