var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var RAW_CSS = require('text!fixtures/raw.css');
var sinon = require('sinon');
var ThemeStyler = require('livefyre-theme-styler');
chai.use(require('sinon-chai'));


describe('ThemeStyler', function() {
  var headEl;
  var themeStyler;

  before(function() {
    headEl = document.getElementsByTagName('head')[0];
  });

  beforeEach(function() {
    themeStyler = new ThemeStyler({ css: RAW_CSS });
  });

  afterEach(function() {
    themeStyler.destroy();
  });

  describe('applyTheme', function() {
    it('should append a style element to the head', function() {
      var initialLen = headEl.childNodes.length;
      themeStyler.applyTheme({});
      expect(themeStyler._styleEls.length).to.equal(1);
      expect(headEl.childNodes.length).to.equal(initialLen + 1);
    });
  });

  describe('destroy', function() {
    it('should remove all style elements from the head', function() {
      var initialLen = headEl.childNodes.length;
      var removeChildSpy = sinon.spy(headEl, 'removeChild');
      themeStyler.applyTheme({});
      themeStyler.applyTheme({});
      themeStyler.applyTheme({});
      expect(themeStyler._styleEls.length).to.equal(3);
      expect(headEl.childNodes.length).to.equal(initialLen + 3);
      themeStyler.destroy();
      expect(removeChildSpy.callCount).to.equal(3);
      expect(themeStyler._styleEls.length).to.equal(0);
      expect(headEl.childNodes.length).to.equal(initialLen);
      removeChildSpy.restore();
    });
  });

  describe('getThemedCss', function() {
    it('should make variable replacements', function() {
      var themedCss = ThemeStyler.getThemedCss(RAW_CSS, {
        testRule1: 'red'
        , testRule3: 'blue'
        , testRule4: 'border-box'
        , testRule5: 'yellow'
      });
      expect(themedCss.indexOf('var(--')).to.equal(-1);
    });

    it('should remove variables that were not replaced (including selector)', function() {
      var themedCss = ThemeStyler.getThemedCss(RAW_CSS, {
        testRule1: 'red'
        , testRule3: 'blue'
        , testRule4: 'border-box'
      });
      expect(themedCss.indexOf('.test-rule5')).to.equal(-1);
    });

    it('should work with no theme', function() {
      var themedCss = ThemeStyler.getThemedCss(RAW_CSS, {});
      var expectedCss = '.test-rule2{color: blue;}.test-rule6 .something1,\n.test-rule6 .something2,\n.test-rule6 .something3{background: purple;}';
      expect(themedCss).to.equal(expectedCss);
    });
  });

  describe('prefixCss', function() {
    it('should add a prefix selector before existing selectors', function() {
      var RAW_CSS = '.one .two, .three { color: red; }';
      var EXPECTED = '.test-prefix .one .two,.test-prefix .three { color: red; }';
      var prefixedCss = ThemeStyler.prefixCss('.test-prefix', RAW_CSS);
      expect(prefixedCss).to.equal(EXPECTED);
    });
  });
});
