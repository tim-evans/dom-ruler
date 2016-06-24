import { getStyles, detectBoxSizing } from "./styles";

/**
  Normalizes margins to return 'auto' or a number
 */
var normalizeMargin = function (margin) {
  if (margin !== 'auto') {
    return parseInt(margin, 10);
  }
  return margin;
};

var getWindowLayout = function (window) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  // IE<8 doesn't support window.innerWidth / window.outerWidth
  return {
    width:     width,
    height:    height,
    boxSizing: null,
    content:   { width: width, height: height },
    borders:   { width: width, height: height },
    margins:   {
      width:  window.outerWidth,
      height: window.outerHeight
    }
  };
};

var getDocumentLayout = function (document) {
  var width = Math.max(
    document.body.scrollWidth, document.documentElement.scrollWidth,
    document.body.offsetWidth, document.documentElement.offsetWidth,
    document.body.clientWidth, document.documentElement.clientWidth
  );
  var height = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );

  // The document has no chrome
  return {
    width:    width,
    height:   height,
    boxSizing: null,
    content: { width: width, height: height },
    borders: { width: width, height: height },
    margins: { width: width, height: height }
  };
};

/**
  Computes the layout of an element that matches
  the inspector properties of the DOM element.
 */
function getLayout(element) {
  // Handle window
  if ((window.Window && element instanceof Window) || // Standards
      element === window) {                           // Safari 5.1
    return getWindowLayout(element);
  }

  // Handle document
  if ((window.Document && element instanceof Document) || // Standards
      element === document) {                             // old IE
    return getDocumentLayout(element);
  }

  var boxSizing = detectBoxSizing(element);
  var clientRect = element.getBoundingClientRect();
  var content = {
    top: clientRect.top,
    left: clientRect.left,
    bottom: clientRect.bottom,
    right: clientRect.right,
    width: clientRect.width,
    height: clientRect.height
  };

  var styles = getStyles(element);
  var layout = {
    width:     null,
    height:    null,
    boxSizing: boxSizing,
    content:   {},
    padding:   {},
    borders:   {},
    margins:   {},
    position:  {}
  };

  var padding = {
    top:    parseInt(styles.paddingTop,        10),
    right:  parseInt(styles.paddingRight,      10),
    bottom: parseInt(styles.paddingBottom,     10),
    left:   parseInt(styles.paddingLeft,       10)
  };
  var borders = {
    top:    parseInt(styles.borderTopWidth,    10),
    right:  parseInt(styles.borderRightWidth,  10),
    bottom: parseInt(styles.borderBottomWidth, 10),
    left:   parseInt(styles.borderLeftWidth,   10)
  };
  var margins = {
    top:    normalizeMargin(styles.marginTop),
    right:  normalizeMargin(styles.marginRight),
    bottom: normalizeMargin(styles.marginBottom),
    left:   normalizeMargin(styles.marginLeft)
  };

  // Normalize the width and height so
  // they refer to the content
  content.width  -= borders.right + borders.left +
                    padding.right + padding.left;
  content.height -= borders.top + borders.bottom +
                    padding.top + padding.bottom;
  layout.content = content;

  padding.width  = content.width +
                   padding.left + padding.right;
  padding.height = content.height +
                   padding.top + padding.bottom;
  layout.padding = padding;

  borders.width  = padding.width +
                   borders.left + borders.right;
  borders.height = padding.height +
                   borders.top + borders.bottom;
  layout.borders = borders;

  // Provide the "true" width and height
  // of the box in terms of the current box model
  switch (boxSizing) {
  case 'border-box':
    layout.width  = borders.width;
    layout.height = borders.height;
    break;
  case 'padding-box':
    layout.width  = padding.width;
    layout.height = padding.height;
    break;
  default:
    layout.width  = content.width;
    layout.height = content.height;
  }

  if (margins.left !== 'auto' && margins.right !== 'auto') {
    margins.width = borders.width +
                    margins.left + margins.right;
  } else {
    margins.width = 'auto';
  }

  if (margins.top !== 'auto' && margins.bottom !== 'auto') {
    margins.height = borders.height +
                     margins.top + margins.bottom;
  } else {
    margins.height = 'auto';
  }
  layout.margins = margins;

  layout.position = {
    top: content.top - padding.top - borders.top - margins.top,
    left: content.left - padding.left - borders.left - margins.left,
    bottom: content.bottom - padding.bottom - borders.bottom - margins.bottom,
    right: content.right - padding.right - borders.right - margins.right
  };

  return layout;
}

export { getLayout };
