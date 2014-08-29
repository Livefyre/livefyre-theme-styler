require.config({
  paths: {
    text: 'lib/requirejs-text/text',
    tinycolor: 'node_modules/tinycolor2/tinycolor'
  },
  packages: [{
    name: "livefyre-theme-styler",
    location: "./src"
  }]
});
