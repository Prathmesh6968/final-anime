import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { miaodaDevPlugin } from 'miaoda-sc-plugin';

export default defineConfig({
  base: './',        // Important for deployed JS/CSS paths
  plugins: [
    react(),
    svgr({
      svgrOptions: { icon: true, exportType: 'named', namedExport: 'ReactComponent' },
    }),
    process.env.NODE_ENV === 'development' ? miaodaDevPlugin() : null
  ].filter(Boolean),
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
