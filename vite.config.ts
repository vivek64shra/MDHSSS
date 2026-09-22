import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function feesSheetProxyPlugin(): Plugin {
  let cachedCsv = '';
  let cacheTime = 0;

  // Background refresh
  const refreshSheet = async () => {
    try {
      const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv0gTbGo5P8wkB4CYuVIWzvXDOu1INb_L8beoaLYrXIyw9noqOIIln5PxxlP2S9apBakQfq48_YLZ8/pub?output=csv';
      const resp = await fetch(sheetUrl);
      if (resp.ok) {
        cachedCsv = await resp.text();
        cacheTime = Date.now();
      }
    } catch (e) {
      // silent background refresh error
    }
  };

  const handleProxy = async (req: any, res: any, next: any) => {
    const fs = await import('fs');
    if (req.url && req.url.startsWith('/api/fees-sheet-csv')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      const now = Date.now();
      if (cachedCsv && now - cacheTime < 5 * 60 * 1000) {
        res.end(cachedCsv);
        return;
      }
      try {
        const localCsvPath = path.resolve(process.cwd(), 'public/fees-data.csv');
        if (fs.existsSync(localCsvPath)) {
          const localCsv = fs.readFileSync(localCsvPath, 'utf8');
          res.end(localCsv);
          refreshSheet();
          return;
        }
      } catch (err: any) {
        // continue to fetch
      }
      try {
        const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv0gTbGo5P8wkB4CYuVIWzvXDOu1INb_L8beoaLYrXIyw9noqOIIln5PxxlP2S9apBakQfq48_YLZ8/pub?output=csv';
        const resp = await fetch(sheetUrl);
        if (!resp.ok) {
          throw new Error(`Sheet returned ${resp.status}`);
        }
        cachedCsv = await resp.text();
        cacheTime = now;
        res.end(cachedCsv);
      } catch (err: any) {
        res.statusCode = 502;
        res.end(`Error fetching sheet: ${err.message}`);
      }
      return;
    }

    if (req.url && req.url.startsWith('/fees-data.json')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      try {
        const jsonPath = path.resolve(process.cwd(), 'public/fees-data.json');
        if (fs.existsSync(jsonPath)) {
          const data = fs.readFileSync(jsonPath, 'utf8');
          res.end(data);
          return;
        }
      } catch (e) {}
    }

    next();
  };

  return {
    name: 'fees-sheet-proxy',
    configureServer(server) {
      server.middlewares.use(handleProxy);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleProxy);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), feesSheetProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
