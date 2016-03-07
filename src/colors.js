'use strict';

var camelCase = require('mout/string/camelCase');
var forOwn = require('mout/object/forOwn');
var has = require('mout/object/has');
var tinycolor = require('tinycolor');

var Colors = {};

/**
 * Blacken the provided color by the provided amount.
 * @param {string} color Color to blacken.
 * @param {number} amt Amount to blacken the color.
 * @return {string} The new hex value of the color.
 */
Colors.blacken = function (color, amt) {
  return tinycolor.mix(color, '#000', amt).toHexString();
};

/**
 * Darken the provided color by the provided amount.
 * @param {string} color Color to darken.
 * @param {number} amt Amount to darken the color.
 * @return {string} The new hex value of the color.
 */
Colors.darken = function (color, amt) {
  return tinycolor(color).darken(amt).toString();
};

/**
 * Use the provided opts as a config for generating colors based on the provided
 * base color argument. With the config, all keys will get prefixed with the
 * provided prefix argument.
 * @param {string} prefix The prefix to add onto the property names.
 * @param {string} color The base color to use when generating.
 * @param {Object} opts The color configuration options.
 * @return {Object} Object containing generated colors.
 */
Colors.generateColors = function (prefix, color, opts) {
  var hasThemes = has(opts, 'light') || has(opts, 'dark');
  var isLight = tinycolor(color).isLight();
  var theme = hasThemes ? (isLight ? opts.light : opts.dark) : opts;
  var _opts = {};

  forOwn(theme, function (prop, key) {
    var activeColor;
    var attrName = camelCase([prefix, key].join('-'));

    if (!prop) {
      _opts[attrName] = color;
      return;
    }
    activeColor = prop.color ? prop.color : color;

    if (!prop.fn) {
      _opts[attrName] = activeColor;
      return;
    }
    _opts[attrName] = Colors[prop.fn](activeColor, prop.amt);
  });

  return _opts;
};

/**
 * Lighten the provided color by the provided amount.
 * @param {string} color Color to lighten.
 * @param {number} amt Amount to lighten the color.
 * @return {string} The new hex value of the color.
 */
Colors.lighten = function (color, amt) {
  return tinycolor(color).lighten(amt).toString();
};

module.exports = Colors;
