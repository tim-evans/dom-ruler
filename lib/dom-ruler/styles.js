import { pluck, merge } from "./utils";

// A list of all of the style properties
// to copy over to our example element
var LAYOUT_STYLES = [
  'maxWidth',
  'maxHeight',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'borderLeftStyle',
  'borderRightStyle',
  'borderTopStyle',
  'borderBottomStyle',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontVariant',
  'lineHeight',
  'whiteSpace',
  'letterSpacing',
  'wordWrap',
  'boxSizing',
  'MozBoxSizing',
  'textTransform',
  'textRendering',
  // Font feature settings
  'webkitFontFeatureSettings',
  'mozFontFeatureSettings',
  'msFontFeatureSettings',
  'oFontFeatureSettings',
  'fontFeatureSettings'
];

var DEFAULT_BOX_SIZING;

// Retrieve the computed style of the element
var getStyles = function (element) {
  if (element == null) {
    throw new Error("Cannot get styles on an element that doesn't exist");
  }
  if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView.getComputedStyle(element, null);
  }
  return element.currentStyle;
};

var copyStyles = function (element, targetElement) {
  var styles = pluck(getStyles(element), LAYOUT_STYLES);
  merge(targetElement.style, styles);
};

/**
  Detect the browser's default box sizing.
  This should detect old IE quirks and then
  provide the correct box model when detecting
  per-element box-sizing.

  @private
 */
var detectDefaultBoxSizing = function () {
  var tester = document.createElement('div');
  var boxSizing;

  document.body.appendChild(tester);
  merge(tester.style, {
    width: '24px',
    padding: '10px',
    border: '2px solid #000',
    boxSizing: 'content-box',
    MozBoxSizing: 'content-box'
  });

  switch (tester.offsetWidth) {
  case 24:
    boxSizing = 'border-box';
    break;
  case 44:
    boxSizing = 'padding-box';
    break;
  case 48:
    boxSizing = 'content-box';
    break;
  }

  document.body.removeChild(tester);
  return boxSizing;
};

var detectBoxSizing = function (element) {
  // Detect the browser's default box sizing model
  if (DEFAULT_BOX_SIZING == null) {
    DEFAULT_BOX_SIZING = detectDefaultBoxSizing();
  }

  var styles = getStyles(element);
  return styles.boxSizing       ||
         styles.webkitBoxSizing ||
         styles.MozBoxSizing    ||
         styles.msBoxSizing     ||
         styles.oBoxSizing      ||
         DEFAULT_BOX_SIZING;
};


export {
  getStyles,
  copyStyles,
  detectBoxSizing
};
