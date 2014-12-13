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

  describe('_addStyleToDOM', function() {
    it('should add a new element when there are none', function() {
      var initialLen = headEl.childNodes.length;
      var elem = document.createElement('style');
      elem.innerHTML = '.test { color: red; }';
      themeStyler._addStyleToDOM(elem);
      expect(themeStyler._styleEls.length).to.equal(1);
      expect(headEl.childNodes.length).to.equal(initialLen + 1);
    });

    it('should add a new element and remove an old one if there is one', function() {
      var initialLen = headEl.childNodes.length;
      var elem = document.createElement('style');
      elem.innerHTML = '.test { color: red; }';
      var elem2 = document.createElement('style');
      elem2.innerHTML = '.test { color: blue; }';
      themeStyler._addStyleToDOM(elem);
      expect(themeStyler._styleEls.length).to.equal(1);
      expect(headEl.childNodes.length).to.equal(initialLen + 1);
      var lastChild = headEl.childNodes[headEl.childNodes.length-1];
      expect(lastChild.innerHTML.indexOf('color: red;')).to.be.gt(-1);
      themeStyler._addStyleToDOM(elem2);
      expect(themeStyler._styleEls.length).to.equal(1);
      expect(headEl.childNodes.length).to.equal(initialLen + 1);
      lastChild = headEl.childNodes[headEl.childNodes.length-1];
      expect(lastChild.innerHTML.indexOf('color: red;')).to.equal(-1);
      expect(lastChild.innerHTML.indexOf('color: blue;')).to.be.gt(-1);
    });
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
      expect(themeStyler._styleEls.length).to.equal(1);
      expect(headEl.childNodes.length).to.equal(initialLen + 1);
      themeStyler.destroy();
      // Should be called 3 times because `applyTheme` calls it when there is
      // a style element already, so it happens 2x since we're calling
      // `applyTheme` 3x. Also, we call `destroy` once, so that calls it the
      // 3rd time.
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
        , testRule4: 'border-box'
      });
      expect(themedCss.indexOf('.test-rule3')).to.equal(-1);
      expect(themedCss.indexOf('.test-rule7')).to.equal(-1);
    });

    it('should remove variables that were not replaced (selector should stay if rules exist)', function() {
      var themedCss = ThemeStyler.getThemedCss(RAW_CSS, {
        testRule1: 'red'
        , testRule3: 'blue'
        , testRule4: 'border-box'
      });
      expect(themedCss.indexOf('.test-rule5')).to.be.gt(-1);
      expect(themedCss.indexOf('.test-rule5 .something + .something-else{\n  background-color: blue;}')).to.be.gt(-1);
    });

    it('should work with no theme', function() {
      var themedCss = ThemeStyler.getThemedCss(RAW_CSS, {});
      var expectedCss = '.test-rule2{color: blue;}.test-rule5 .something + .something-else{\n  background-color: blue;}.test-rule6 .something1,\n.test-rule6 .something2,\n.test-rule6 .something3{background: purple;}';
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
