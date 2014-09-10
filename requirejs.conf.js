require.config({
  paths: {
    text: 'lib/requirejs-text/text',
    tinycolor: 'lib/tinycolor/tinycolor'
  },
  packages: [{
    name: "livefyre-theme-styler",
    location: "./src"
  }]
});
