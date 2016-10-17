"use strict";
var styles_1 = require("./styles");
var utils_1 = require("./utils");
var layout_1 = require("./layout");
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
        utils_1.merge(parent.style, {
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
        styles = styles_1.getStyles(exampleElement);
        styles_1.copyStyles(exampleElement, element);
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
    utils_1.merge(element.style, {
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
exports.prepareTextMeasurement = prepareTextMeasurement;
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
exports.teardownTextMeasurement = teardownTextMeasurement;
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
exports.setText = setText;
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
    utils_1.merge({ escape: true, template: null }, options);
    if (options.template == null && !hasStyles) {
        throw new Error("A template element or a styles hash is required to measure text.");
    }
    prepareTextMeasurement(options.template, styles);
    var element = metricsCalculationElement;
    setText(string, options.escape);
    var metrics = layout_1.getLayout(element);
    teardownTextMeasurement();
    return metrics;
}
exports.measureText = measureText;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVCQUFzQyxVQUFVLENBQUMsQ0FBQTtBQUNqRCxzQkFBc0IsU0FBUyxDQUFDLENBQUE7QUFDaEMsdUJBQTBCLFVBQVUsQ0FBQyxDQUFBO0FBRXJDLElBQUkseUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBRXJDOztHQUVHO0FBQ0gsZ0NBQWdDLGNBQWMsRUFBRSxnQkFBZ0I7SUFDOUQsSUFBSSxPQUFPLEdBQUcseUJBQXlCLENBQUM7SUFDeEMsZ0JBQWdCLEdBQUcsZ0JBQWdCLElBQUksRUFBRSxDQUFDO0lBRTFDLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsRUFBRSxHQUFHLHlCQUF5QixDQUFDO1FBQ3RDLGFBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1lBQ2xCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLElBQUksRUFBRSxVQUFVO1lBQ2hCLEdBQUcsRUFBRSxPQUFPO1lBQ1osS0FBSyxFQUFFLFNBQVM7WUFDaEIsTUFBTSxFQUFFLEtBQUs7WUFDYixRQUFRLEVBQUUsUUFBUTtZQUNsQixVQUFVLEVBQUUsUUFBUTtTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPLEdBQUcseUJBQXlCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVwRSxNQUFNLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDOUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsRUFBRSxDQUFDLENBQUMsY0FBYyxD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