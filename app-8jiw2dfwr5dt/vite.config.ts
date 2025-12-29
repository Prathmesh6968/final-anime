export default defineConfig({
  base: './',  // important for deployed JS/CSS
  plugins: [
    react(),
    svgr({ svgrOptions: { icon: true, exportType: 'named', namedExport: 'ReactComponent' } }),
    miaodaDevPlugin()
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
