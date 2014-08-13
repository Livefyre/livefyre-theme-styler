var backgroundColorCss = require('text!livefyre-theme-styler/styles/card-background-color.css');
var linkColorCss = require('text!livefyre-theme-styler/styles/link-color.css');
var textColorCss = require('text!livefyre-theme-styler/styles/text-color.css');
var footerTextColorCss = require('text!livefyre-theme-styler/styles/footer-text-color.css');
var displayNameColorCss = require('text!livefyre-theme-styler/styles/display-name-color.css');
var usernameColorCss = require('text!livefyre-theme-styler/styles/username-color.css');

var HEAD_EL = document.getElementsByTagName('head')[0];

var ThemeStyler = function (opts) {
    opts = opts || {};
    this._styleEl = document.createElement('style');
    HEAD_EL.appendChild(this._styleEl);
    var packageAttribute = opts.packageAttribute || {};
    this._stylePrefix = opts.prefix || ['[',packageAttribute.attribute,'~="',packageAttribute.value,'"] '].join('');
};

ThemeStyler.prototype.applyTheme = function (theme) {
    var cssText = getThemeCss(theme);
    var prefixedCss = prefixCss(this._stylePrefix, cssText);
    this._styleEl.innerHTML = prefixedCss;
};

function prefixCss(prefix, cssText) {
    var match, results = [],
        cssPattern = new RegExp("([^\\s][\\s\\S]*?)(\\{[\\s\\S]*?\\})", "g"),
        selectors, prefixedSelectors;

    while (match = cssPattern.exec(cssText)) {
        //There might be a concatenation of selectors, explode them
        selectors = match[1].split(",");
        prefixedSelectors = [];

        for (var i = 0, l = selectors.length; i < l; i += 1) {
           prefixedSelectors.push(prefix + selectors[i]);
        }
        results.push(prefixedSelectors.join(","), match[2]);
    }

    return results.join("");
};

function getThemeCss(theme) {
    var cssVarRegex = /var\(--[\w-]+\)/g;
    var cssStyles = [];
    for (var themeVar in theme) {
        if (theme.hasOwnProperty(themeVar)) {
            var val = theme[themeVar];
            var cssText = getStyleTemplate(themeVar);
            cssText = cssText.replace(cssVarRegex, val);
            cssStyles.push(cssText);
        }
    }
    return cssStyles.join(''); 
};

ThemeStyler.getThemeOpts = function (opts) {
    var themeOpts = {};

    for (var opt in opts) {
        if (opts.hasOwnProperty(opt)) {
           if (Object.keys(ThemeStyler.TEMPLATE_MAP).indexOf(opt) >= 0) {
                themeOpts[opt] = opts[opt];
            }
        }
    }

    return themeOpts;
};

ThemeStyler.TEMPLATE_MAP = {
    cardBackgroundColor: backgroundColorCss,
    linkColor: linkColorCss,
    textColor: textColorCss,
    footerTextColor: footerTextColorCss,
    displayNameColor: displayNameColorCss,
    usernameColor: usernameColorCss
};

function getStyleTemplate(themeVar) {
    return ThemeStyler.TEMPLATE_MAP[themeVar];
};

module.exports = ThemeStyler;
