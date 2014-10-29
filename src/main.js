'use strict';

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
var bodyFontSizeCss = require('text!livefyre-theme-styler/styles/body-font-size.css');
var bodyLineHeightCss = require('text!livefyre-theme-styler/styles/body-line-height.css');
var titleFontSizeCss = require('text!livefyre-theme-styler/styles/title-font-size.css');
var titleLineHeightCss = require('text!livefyre-theme-styler/styles/title-line-height.css');
var linkAttachmentTextColorCss = require('text!livefyre-theme-styler/styles/link-attachment-text-color.css');
var linkAttachmentBackgroundColorCss = require('text!livefyre-theme-styler/styles/link-attachment-background-color.css');
var linkAttachmentBorderColorCss = require('text!livefyre-theme-styler/styles/link-attachment-border-color.css');

var HEAD_EL = document.getElementsByTagName('head')[0];

var ThemeStyler = function (opts) {
    opts = opts || {};
    this._styleEls = [];
    var packageAttribute = opts.packageAttribute || {};
    this._stylePrefix = opts.prefix || ['[',packageAttribute.attribute,'~="',packageAttribute.value,'"] '].join('');
};

ThemeStyler.prototype.applyTheme = function (theme) {
    var themeOpts = ThemeStyler.getThemeOpts(theme);
    var cssText = getThemeCss(themeOpts);
    var prefixedCss = prefixCss(this._stylePrefix, cssText);
    var styleEl = document.createElement('style');
    styleEl.innerHTML = prefixedCss;
    HEAD_EL.appendChild(styleEl);
    this._styleEls.push(styleEl);
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

ThemeStyler.prototype.destroy = function () {
    for (var i=0; i < this._styleEls.length; i++) {
        var styleEl = this._styleEls[i];
        styleEl.parentNode.removeChild(styleEl);
    }
    this._styleEls = [];
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
    buttonBorderColor: buttonBorderColorCss,
    bodyFontSize: bodyFontSizeCss,
    bodyLineHeight: bodyLineHeightCss,
    titleFontSize: titleFontSizeCss,
    titleLineHeight: titleLineHeightCss,
    linkAttachmentTextColor: linkAttachmentTextColorCss,
    linkAttachmentBackgroundColor: linkAttachmentBackgroundColorCss,
    linkAttachmentBorderColor: linkAttachmentBorderColorCss
};

function getStyleTemplate(themeVar) {
    return ThemeStyler.TEMPLATE_MAP[themeVar];
};

module.exports = ThemeStyler;
