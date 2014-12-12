require.config({
  baseUrl: '/',
  paths: {
    chai: 'lib/chai/chai',
    sinon: 'lib/sinonjs/sinon',
    'sinon-chai': 'lib/sinon-chai/lib/sinon-chai',
    text: 'lib/requirejs-text/text',
    tinycolor: 'lib/tinycolor/tinycolor'
  },
  packages: [{
    name: 'fixtures',
    location: 'test/fixtures'
  }, {
    name: 'livefyre-theme-styler',
    location: 'src'
  }],
  shim: {
    sinon: {
      exports: 'sinon'
    }
  }
});
