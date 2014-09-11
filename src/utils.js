'use strict';

var _ = require('lodash');
var tinycolor = require('tinycolor');

function getBackgroundColorFromThemeOpts(themeOpts) {
    themeOpts = themeOpts || {};
    return themeOpts.cardBackgroundColor ? tinycolor(themeOpts.cardBackgroundColor) : tinycolor('#FFF');
}

function interpolateButtonStyles(themeOpts) {
    var buttonThemeOpts = {};
    var backgroundColor = getBackgroundColorFromThemeOpts(themeOpts);
    if (backgroundColor.isLight()) {
        buttonThemeOpts.buttonTextColor = tinycolor('#000').lighten(40).toHexString();
        buttonThemeOpts.buttonHoverBackgroundColor = backgroundColor.darken(5).toHexString();
        buttonThemeOpts.buttonActiveBackgroundColor = backgroundColor.darken(15).toHexString();
        buttonThemeOpts.buttonBorderColor = 'rgba(0,0,0,0.3)';
    } else if (backgroundColor.isDark()) {
        buttonThemeOpts.buttonTextColor = tinycolor('#FFF').darken(40).toHexString();
        buttonThemeOpts.buttonHoverBackgroundColor = backgroundColor.lighten(5).toHexString();
        buttonThemeOpts.buttonActiveBackgroundColor = backgroundColor.lighten(15).toHexString();
        buttonThemeOpts.buttonBorderColor = 'rgba(0,0,0,0.5)';
    }
    return _.extend(buttonThemeOpts, themeOpts);
}

function interpolateLinkAttachmentStyles(themeOpts) {
    var linkThemeOpts = {};
    var backgroundColor = getBackgroundColorFromThemeOpts(themeOpts);
    if (backgroundColor.isLight()) {
        linkThemeOpts.linkAttachmentTextColor = tinycolor('#000').lighten(40).toHexString();
        linkThemeOpts.linkAttachmentBackgroundColor = backgroundColor.darken(5).toHexString();
        linkThemeOpts.linkAttachmentBorderColor = 'rgba(0,0,0,0.3)';
    } else if (backgroundColor.isDark()) {
        linkThemeOpts.linkAttachmentTextColor = tinycolor('#FFF').darken(40).toHexString();
        linkThemeOpts.linkAttachmentBackgroundColor = backgroundColor.lighten(5).toHexString();
        linkThemeOpts.linkAttachmentBorderColor = 'rgba(0,0,0,0.5)';
    }
    return _.extend(linkThemeOpts, themeOpts);
}

module.exports = {
    interpolateButtonStyles: interpolateButtonStyles,
    interpolateLinkAttachmentStyles: interpolateLinkAttachmentStyles
};
