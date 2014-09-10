var _ = require('lodash');
var tinycolor = require('tinycolor');

'use strict';

function interpolateButtonStyles(themeOpts) {
    var buttonTheme = {};
    var backgroundColor = themeOpts.cardBackgroundColor ? tinycolor(themeOpts.cardBackgroundColor) : tinycolor('#FFF');
    if (backgroundColor.isLight()) {
        buttonthemeOpts.buttonTextColor = tinycolor('#000').lighten(40).toHexString();
        buttonthemeOpts.buttonHoverBackgroundColor = backgroundColor.darken(5).toHexString();
        buttonthemeOpts.buttonActiveBackgroundColor = backgroundColor.darken(15).toHexString();
        buttonthemeOpts.buttonBorderColor = 'rgba(0,0,0,0.3)';
    } else if (backgroundColor.isDark()) {
        buttonthemeOpts.buttonTextColor = tinycolor('#FFF').darken(40).toHexString();
        buttonthemeOpts.buttonHoverBackgroundColor = backgroundColor.lighten(5).toHexString();
        buttonthemeOpts.buttonActiveBackgroundColor = backgroundColor.lighten(15).toHexString();
        buttonthemeOpts.buttonBorderColor = 'rgba(0,0,0,0.5)';
    }
    return _.extend(buttonTheme, themeOpts);
}

module.exports = {
    interpolateButtonStyles: interpolateButtonStyles
}
