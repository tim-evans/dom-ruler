(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.DomRuler = global.DomRuler || {})));
}(this, function (exports) { 'use strict';

    // modified from
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    var keys = Object.keys || (function () {
        var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'), dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ], dontEnumsLength = dontEnums.length;
        return function keys(obj) {
            if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                throw new TypeError('Object.keys called on non-object');
            }
            var result = [], i;
            if (hasDontEnumBug) {
                for (i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }());
    var slice = Array.prototype.slice;
    var merge = function (target) {
        var mixins = slice.call(arguments, 1);
        for (var i = 0, len = mixins.length; i < len; i++) {
            var mixin = mixins[i] || {};
            var mixinKeys = keys(mixin);
            for (var j = 0, jLen = mixinKeys.length; j < jLen; j++) {
                var key = mixinKeys[j];
                target[key] = mixin[key];
            }
        }
        return target;
    };
    var pluck = function (object, array) {
        var pluckedProperties = {};
        for (var i = 0, len = array.length; i < len; i++) {
            var property = array[i];
            pluckedProperties[property] = object[property];
        }
        return pluckedProperties;
    };

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
        return styles.boxSizing ||
            styles.webkitBoxSizing ||
            styles.MozBoxSizing ||
            styles.msBoxSizing ||
            styles.oBoxSizing ||
            DEFAULT_BOX_SIZING;
    };

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
            width: width,
            height: height,
            boxSizing: null,
            content: { width: width, height: height },
            borders: { width: width, height: height },
            margins: {
                width: window.outerWidth,
                height: window.outerHeight
            }
        };
    };
    var getDocumentLayout = function (document) {
        var width = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth, document.body.offsetWidth, document.documentElement.offsetWidth, document.body.clientWidth, document.documentElement.clientWidth);
        var height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
        // The document has no chrome
        return {
            width: width,
            height: height,
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
        if ((window.Window && element instanceof Window) ||
            element === window) {
            return getWindowLayout(element);
        }
        // Handle document
        if ((window.Document && element instanceof Document) ||
            element === document) {
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
            width: null,
            height: null,
            boxSizing: boxSizing,
            content: {},
            padding: {},
            borders: {},
            margins: {},
            position: {}
        };
        var padding = {
            top: parseInt(styles.paddingTop, 10),
            right: parseInt(styles.paddingRight, 10),
            bottom: parseInt(styles.paddingBottom, 10),
            left: parseInt(styles.paddingLeft, 10)
        };
        var borders = {
            top: parseInt(styles.borderTopWidth, 10),
            right: parseInt(styles.borderRightWidth, 10),
            bottom: parseInt(styles.borderBottomWidth, 10),
            left: parseInt(styles.borderLeftWidth, 10)
        };
        var margins = {
            top: normalizeMargin(styles.marginTop),
            right: normalizeMargin(styles.marginRight),
            bottom: normalizeMargin(styles.marginBottom),
            left: normalizeMargin(styles.marginLeft)
        };
        // Normalize the width and height so
        // they refer to the content
        content.width -= borders.right + borders.left +
            padding.right + padding.left;
        content.height -= borders.top + borders.bottom +
            padding.top + padding.bottom;
        layout.content = content;
        padding.width = content.width +
            padding.left + padding.right;
        padding.height = content.height +
            padding.top + padding.bottom;
        layout.padding = padding;
        borders.width = padding.width +
            borders.left + borders.right;
        borders.height = padding.height +
            borders.top + borders.bottom;
        layout.borders = borders;
        // Provide the "true" width and height
        // of the box in terms of the current box model
        switch (boxSizing) {
            case 'border-box':
                layout.width = borders.width;
                layout.height = borders.height;
                break;
            case 'padding-box':
                layout.width = padding.width;
                layout.height = padding.height;
                break;
            default:
                layout.width = content.width;
                layout.height = content.height;
        }
        if (margins.left !== 'auto' && margins.right !== 'auto') {
            margins.width = borders.width +
                margins.left + margins.right;
        }
        else {
            margins.width = 'auto';
        }
        if (margins.top !== 'auto' && margins.bottom !== 'auto') {
            margins.height = borders.height +
                margins.top + margins.bottom;
        }
        else {
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
            if (styles.fontStyle) {
                font += styles.fontStyle + " ";
            }
            if (styles.fontVariant) {
                font += styles.fontVariant + " ";
            }
            if (styles.fontWeight) {
                font += styles.fontWeight + " ";
            }
            if (styles.fontSize) {
                font += styles.fontSize + " ";
            }
            else {
                font += "10px";
            }
            if (styles.lineHeight) {
                font += "/" + styles.lineHeight;
            }
            font += " ";
            if (styles.fontFamily) {
                font += styles.fontFamily;
            }
            else {
                font += "sans-serif";
            }
            element.style.font = font;
        }
        merge(element.style, {
            position: "absolute",
            top: "0px",
            right: "auto",
            bottom: "auto",
            left: "0px",
            width: "auto",
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
        }
        else if (typeof element.innerText !== "undefined") {
            element.innerText = string;
        }
        else {
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

    exports.getLayout = getLayout;
    exports.measureText = measureText;
    exports.getStyles = getStyles;

    Object.defineProperty(exports, '__esModule', { value: true });

}));