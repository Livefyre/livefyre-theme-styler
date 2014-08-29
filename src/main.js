var backgroundColorCss = require('text!livefyre-theme-styler/styles/card-background-color.css');
var linkColorCss = require('text!livefyre-theme-styler/styles/link-color.css');
var textColorCss = require('text!livefyre-theme-styler/styles/text-color.css');
var footerTextColorCss = require('text!livefyre-theme-styler/styles/footer-text-color.css');
var displayNameColorCss = require('text!livefyre-theme-styler/styles/display-name-color.css');
var usernameColorCss = require('text!livefyre-theme-styler/styles/username-color.css');
var fontFamilyCss = require('text!livefyre-theme-styler/styles/font-family.css');
var sourceLogoColorCss = require('text!livefyre-theme-styler/styles/source-logo-color.css');
var buttonTextColorCss = require('text!livefyre-theme-styler/styles/button-text-color.css');
var buttonHoverBackgroundColorCss = require('text!livefyre-theme-styler/styles/button-hover-background-color.css');
var buttonActiveBackgroundColorCss = require('text!livefyre-theme-styler/styles/button-active-background-color.css');
var buttonBorderColorCss = require('text!livefyre-theme-styler/styles/button-border-color.css');
var tinycolor = require('tinycolor');

var HEAD_EL = document.getElementsByTagName('head')[0];

var ThemeStyler = function (opts) {
    opts = opts || {};
    this._styleEl = document.createElement('style');
    HEAD_EL.appendChild(this._styleEl);
    var packageAttribute = opts.packageAttribute || {};
    this._stylePrefix = opts.prefix || ['[',packageAttribute.attribute,'~="',packageAttribute.value,'"] '].join('');
};

ThemeStyler.prototype.applyTheme = function (theme) {
    var themeOpts = ThemeStyler.getThemeOpts(theme);
    var cssText = getThemeCss(themeOpts);
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

    // Get button styles
    var backgroundColor = tinycolor(theme.cardBackgroundColor);
    if (backgroundColor.isLight()) {
        theme.buttonTextColor = tinycolor('#000').lighten(40).toHexString();
        theme.buttonHoverBackgroundColor = backgroundColor.darken(5).toHexString();
        theme.buttonActiveBackgroundColor = backgroundColor.darken(15).toHexString();
        theme.buttonBorderColor = 'rgba(0,0,0,0.3)';
    } else if (backgroundColor.isDark()) {
        theme.buttonTextColor = tinycolor('#FFF').darken(40).toHexString();
        theme.buttonHoverBackgroundColor = backgroundColor.lighten(5).toHexString();
        theme.buttonActiveBackgroundColor = backgroundColor.lighten(15).toHexString();
        theme.buttonBorderColor = 'rgba(0,0,0,0.5)';
    }

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
    usernameColor: usernameColorCss,
    fontFamily: fontFamilyCss,
    sourceLogoColor: sourceLogoColorCss,
    buttonTextColor: buttonTextColorCss,
    buttonHoverBackgroundColor: buttonHoverBackgroundColorCss,
    buttonActiveBackgroundColor: buttonActiveBackgroundColorCss,
    buttonBorderColor: buttonBorderColorCss
};

function getStyleTemplate(themeVar) {
    return ThemeStyler.TEMPLATE_MAP[themeVar];
};

module.exports = ThemeStyler;
