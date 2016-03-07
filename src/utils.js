'use strict';

var ColorGenerator = require('./colors');
var merge = require('mout/object/merge');
var tinycolor = require('tinycolor');

function getBackgroundColorFromThemeOpts(themeOpts) {
  themeOpts = themeOpts || {};
  return themeOpts.cardBackgroundColor ? tinycolor(themeOpts.cardBackgroundColor) : tinycolor('#FFF');
}

function interpolateButtonStyles(themeOpts) {
  var backgroundColor = getBackgroundColorFromThemeOpts(themeOpts);
  var buttonThemeOpts = ColorGenerator.generateColors('button', backgroundColor, {
    light: {
      activeBackgroundColor: {fn: 'darken', amt: 15},
      borderColor: {color: 'rgba(0,0,0,0.3)'},
      hoverBackgroundColor: {fn: 'darken', amt: 5},
      textColor: {color: '#000', fn: 'lighten', amt: 40}
    },
    dark: {
      activeBackgroundColor: {fn: 'lighten', amt: 15},
      borderColor: {color: 'rgba(0,0,0,0.5)'},
      hoverBackgroundColor: {fn: 'lighten', amt: 5},
      textColor: {color: '#fff', fn: 'darken', amt: 40}
    }
  });
  return merge(buttonThemeOpts, themeOpts);
}

function interpolateLinkAttachmentStyles(themeOpts) {
  var backgroundColor = getBackgroundColorFromThemeOpts(themeOpts);
  var linkThemeOpts = ColorGenerator.generateColors('linkAttachment', backgroundColor, {
    light: {
      backgroundColor: {fn: 'darken', amt: 5},
      borderColor: {color: 'rgba(0,0,0,0.3)'},
      textColor: {color: '#000', fn: 'lighten', amt: 40}
    },
    dark: {
      backgroundColor: {fn: 'lighten', amt: 5},
      borderColor: {color: 'rgba(0,0,0,0.5)'},
      textColor: {color: '#fff', fn: 'darken', amt: 40}
    }
  });
  return merge(linkThemeOpts, themeOpts);
}

module.exports = {
  interpolateButtonStyles: interpolateButtonStyles,
  interpolateLinkAttachmentStyles: interpolateLinkAttachmentStyles
};
