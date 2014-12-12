'use strict';

/** @const {Element} */
var HEAD_EL = document.getElementsByTagName('head')[0];

/**
 * Theme styler module. Allows users to apply themes to a CSS stylesheet string.
 * @constructor
 * @param {Object} opts The configuration options.
 */
function ThemeStyler(opts) {
  opts = opts || {};

  /**
   * CSS string with replacement vars within it. Will be replaced by the theme
   * in the `applyTheme` function.
   * @type {string}
   * @private
   */
  this._themableCss = opts.css || '';

  /**
   * List containing references to the style elements that are added to the HEAD
   * element in the `applyTheme` function.
   * @type {Array.<Element>}
   * @private
   */
  this._styleEls = [];

  /**
   * Prefix to apply to the CSS rules.
   * @type {string}
   * @private
   */
  this._stylePrefix = opts.prefix;
}

/**
 * Adds the style element to the DOM. Removes the previously added style element
 * also, so that there is only ever 1 at a given time.
 * @param {Element} styleEl The style element to add.
 * @private
 */
ThemeStyler.prototype._addStyleToDOM = function(styleEl) {
  var oldStyleEl = this._styleEls.pop();
  HEAD_EL.appendChild(styleEl);
  this._styleEls.push(styleEl);
  oldStyleEl && HEAD_EL.removeChild(oldStyleEl);
};

/**
 * Apply a theme to the css provided in the constructor. This will take the css
 * and do all replacements based on the `theme` argument. All replacement vars
 * that were not replaced will be removed. This also injects the completed CSS
 * into the DOM and keeps track of the element for disposal later.
 * @param {Object} theme Object containing key/value pairs of replacements.
 */
ThemeStyler.prototype.applyTheme = function(theme) {
  var cssText = ThemeStyler.getThemedCss(this._themableCss, theme);
  var prefixedCss = ThemeStyler.prefixCss(this._stylePrefix, cssText);
  var styleEl = document.createElement('style');
  styleEl.innerHTML = prefixedCss;
  this._addStyleToDOM(styleEl);
};

/**
 * Remove all style elements that were appended to the head element.
 */
ThemeStyler.prototype.destroy = function() {
  var styleEl;
  for (var i = 0; i < this._styleEls.length; i++) {
    styleEl = this._styleEls[i];
    styleEl.parentNode.removeChild(styleEl);
  }
  this._styleEls = [];
};

/**
 * Get themed css. Takes raw CSS and a theme and does replacements to theme it.
 * @param {string} rawCss Raw string CSS with replacement variables.
 * @param {Object} theme Object containing key/value pairs of replacements.
 * @return {string} Fully-replaced CSS string.
 */
ThemeStyler.getThemedCss = function(rawCss, theme) {
  var cssVarRegex;
  var themedCss = rawCss;
  var cssValue;

  // Loop through all elements in the theme, doing the replacements on the CSS
  // for each one.
  for (var themeVar in theme) {
    if (theme.hasOwnProperty(themeVar)) {
      cssValue = theme[themeVar];
      cssVarRegex = new RegExp('var\\(--' + themeVar + '\\)', 'g');
      themedCss = themedCss.replace(cssVarRegex, cssValue);
    }
  }

  // Clean up whitespace in the css in order for the following regex replacement
  // to be able to do it's thing.
  themedCss = themedCss.replace(/(\s*)(\}|\{)(\s*)/g, '$2');
  // Clear out any styles that have not been replaced. This could be due to
  // the user not wanting the style to be applied or it's a new style that
  // hasn't been configured yet.
  themedCss = themedCss.replace(/([a-zA-Z_-]+: var\(--\w+\);)/g, '');
  // Clear out any rules that don't have any properties within them. This will
  // only be the case when no replacement was made and the attribute was cleaned.
  themedCss = themedCss.replace(/(\}?)([^\}]*\{[\s\\n]*\})/g, '$1');

  return themedCss;
};

/**
 * Prefix the CSS selectors with app/instance specific strings to differentiate
 * them from other apps/instances on the same page.
 * @param {string} prefix The prefix to add to the CSS definitions.
 * @param {string} cssText CSS string to prefix.
 * @return {string} Prefixed CSS.
 */
ThemeStyler.prefixCss = function(prefix, cssText) {
  var match, results = [];
  var cssPattern = new RegExp("([^\\s][\\s\\S]*?)(\\{[\\s\\S]*?\\})", "g");
  var selector;
  var selectors;
  var prefixedSelectors;

  while (match = cssPattern.exec(cssText)) {
    //There might be a concatenation of selectors, explode them
    selectors = match[1].split(",");
    prefixedSelectors = [];

    for (var i = 0, l = selectors.length; i < l; i += 1) {
      selector = selectors[i];
      if (!/^\s/.test(selector)) {
        selector = ' ' + selector;
      }
      prefixedSelectors.push(prefix + selector);
    }
    results.push(prefixedSelectors.join(","), match[2]);
  }

  return results.join("");
};

module.exports = ThemeStyler;
