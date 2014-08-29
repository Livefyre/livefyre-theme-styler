require.config({
  paths: {
    text: 'lib/requirejs-text/text',
    tinycolor: 'lib/tinycolor2/tinycolor'
  },
  packages: [{
    name: "livefyre-theme-styler",
    location: "./src"
  }]
});
