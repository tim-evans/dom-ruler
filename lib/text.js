import { getStyles, copyStyles } from "./styles";
import { merge } from "./utils";
import { getLayout } from "./layout";

var metricsCalculationElement = null;

/**
  Prepare for measuring the layout of a string.
 */
function prepareTextMeasurement(exampleElement, additionalStyles) {
  var element = metricsCalculationElement;
  additionalStyles = additionalStyles || {};

  if (metricsCalculationElement == null) {
    var parent = document.createElement('div');
    parent.id = "dom_ruler-text_measurer";
    merge(parent.style, {
      position: 'absolute',
      left: '-10010px',
      top: '-10px',
      width: '10000px',
      height: '0px',
      overflow: 'hidden',
      visibility: 'hidden'
    });

    element = metricsCalculationElement = document.createElement('div');

    parent.appendChild(metricsCalculationElement);
    document.body.insertBefore(parent, null);
  }

  var styles = {};
  if (exampleElement) {
    styles = getStyles(exampleElement);
    copyStyles(exampleElement, element);
  }

  // Explicitly set the `font` property for Mozilla
  var font = "";
  if (styles.font === "") {
    if (styles.fontStyle)   { font += styles.fontStyle   + " "; }
    if (styles.fontVariant) { font += styles.fontVariant + " "; }
    if (styles.fontWeight)  { font += styles.fontWeight  + " "; }
    if (styles.fontSize)    { font += styles.fontSize    + " "; }
    else                    { font += "10px";                   }
    if (styles.lineHeight)  { font += "/" + styles.lineHeight;  }

    font += " ";
    if (styles.fontFamily)  { font += styles.fontFamily; }
    else                    { font += "sans-serif";      }

    element.style.font = font;
  }

  merge(element.style, {
    position: "absolute",
    top:    "0px",
    right:  "auto",
    bottom: "auto",
    left:   "0px",
    width:  "auto",
    height: "auto"
  }, additionalStyles);

  return element;
}

/**
  Cleanup properties used by `measureString`
  setup in `prepareStringMeasurement`.
 */
function teardownTextMeasurement() {
  // Remove any leftover styling from string measurements
  if (metricsCalculationElement) {
    metricsCalculationElement.innerHTML = "";
    metricsCalculationElement.removeAttribute('class');
    metricsCalculationElement.removeAttribute('style');
  }
}

function setText(string, escape) {
  var element = metricsCalculationElement;
  if (!escape) {
    element.innerHTML = string;

  // Escape the string by entering it as
  // a text node to the DOM element
  } else if (typeof element.innerText !== "undefined") {
    element.innerText = string;
  } else {
    element.textContent = string;
  }

  // Trigger a repaint so the height and width are correct
  // Webkit / Blink needs this to trigger a reflow
  element.style.overflow = 'visible';
  element.style.overflow = 'hidden';
}

/**
  Measures a string given the styles applied
  when setting up string measurements.

  @param string {String} The string to measure
  @param options {Object} A hash of values (whether to escape the value or not)
  @return {Object} The layout of the string passed in.
 */
function measureText(string, styles, options) {
  var hasStyles = true;
  if (options == null) {
    options = styles;
    styles = {};
    hasStyles = false;
  }
  merge({ escape: true, template: null }, options);

  if (options.template == null && !hasStyles) {
    throw new Error("A template element or a styles hash is required to measure text.");
  }

  prepareTextMeasurement(options.template, styles);

  var element = metricsCalculationElement;
  setText(string, options.escape);
  var metrics = getLayout(element);
  teardownTextMeasurement();

  return metrics;
}

export {
  prepareTextMeasurement,
  setText,
  teardownTextMeasurement,
  measureText
};
