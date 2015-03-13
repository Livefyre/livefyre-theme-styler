require.config({
  baseUrl: '/',
  paths: {
    chai: 'lib/chai/chai',
    sinon: 'lib/sinonjs/sinon',
    'sinon-chai': 'lib/sinon-chai/lib/sinon-chai',
    text: 'lib/requirejs-text/text',
  },
  packages: [{
    name: 'fixtures',
    location: 'test/fixtures'
  }, {
    name: 'livefyre-theme-styler',
    location: 'src'
  }, {
    name: 'livefyre-theme-styler/colors',
    location: 'src',
    main: 'colors'
  }, {
    name: 'livefyre-theme-styler/utils',
    location: 'src',
    main: 'utils'
  }],
  shim: {
    sinon: {
      exports: 'sinon'
    }
  }
});
