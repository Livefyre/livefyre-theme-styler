var _ = require('lodash');
var tinycolor = require('tinycolor');

'use strict';

function interpolateButtonStyles(themeOpts) {
    var buttonThemeOpts = {};
    var backgroundColor = themeOpts.cardBackgroundColor ? tinycolor(themeOpts.cardBackgroundColor) : tinycolor('#FFF');
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

module.exports = {
    interpolateButtonStyles: interpolateButtonStyles
}
