"use strict";
var utils_1 = require("./utils");
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
exports.getStyles = getStyles;
var copyStyles = function (element, targetElement) {
    var styles = utils_1.pluck(getStyles(element), LAYOUT_STYLES);
    utils_1.merge(targetElement.style, styles);
};
exports.copyStyles = copyStyles;
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
    utils_1.merge(tester.style, {
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
exports.detectBoxSizing = detectBoxSizing;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3R5bGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQkFBNkIsU0FBUyxDQUFDLENBQUE7QUFFdkMsd0NBQXdDO0FBQ3hDLHNDQUFzQztBQUN0QyxJQUFJLGFBQWEsR0FBRztJQUNsQixVQUFVO0lBQ1YsV0FBVztJQUNYLGFBQWE7SUFDYixjQUFjO0lBQ2QsWUFBWTtJQUNaLGVBQWU7SUFDZixpQkFBaUI7SUFDakIsa0JBQWtCO0lBQ2xCLGdCQUFnQjtJQUNoQixtQkFBbUI7SUFDbkIsaUJBQWlCO0lBQ2pCLGtCQUFrQjtJQUNsQixnQkFBZ0I7SUFDaEIsbUJBQW1CO0lBQ25CLFlBQVk7SUFDWixVQUFVO0lBQ1YsWUFBWTtJQUNaLGFBQWE7SUFDYixZQUFZO0lBQ1osWUFBWTtJQUNaLGVBQWU7SUFDZixVQUFVO0lBQ1YsV0FBVztJQUNYLGNBQWM7SUFDZCxlQUFlO0lBQ2YsZUFBZTtJQUNmLHdCQUF3QjtJQUN4QiwyQkFBMkI7SUFDM0Isd0JBQXdCO0lBQ3hCLHVCQUF1QjtJQUN2QixzQkFBc0I7SUFDdEIscUJBQXFCO0NBQ3RCLENBQUM7QUFFRixJQUFJLGtCQUFrQixDQUFDO0FBRXZCLDZDQUE2QztBQUM3QyxJQUFJLFNBQVMsR0FBRyxVQUFVLE9BQU87SUFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsV0FBVyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUM7QUFDOUIsQ0FBQztBQTZEQyxpQkFBUyxhQTdEVDtBQUVGLElBQUksVUFBVSxHQUFHLFVBQVUsT0FBTyxFQUFFLGFBQWE7SUFDL0MsSUFBSSxNQUFNLEdBQUcsYUFBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN0RCxhQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBeURDLGtCQUFVLGNBekRWO0FBRUY7Ozs7Ozs7R0FPRztBQUNILElBQUksc0JBQXNCLEdBQUc7SUFDM0IsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxJQUFJLFNBQVMsQ0FBQztJQUVkLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLGFBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2xCLEtBQUssRUFBRSxNQUFNO1FBQ2IsT0FBTyxFQUFFLE1BQU07UUFDZixNQUFNLEVBQUUsZ0JBQWdCO1FBQ3hCLFNBQVMsRUFBRSxhQUFhO1FBQ3hCLFlBQVksRUFBRSxhQUFhO0tBQzVCLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzdCLEtBQUssRUFBRTtZQUNMLFNBQVMsR0FBRyxZQUFZLENBQUM7WUFDekIsS0FBSyxDQUFDO1FBQ1IsS0FBSyxFQUFFO1lBQ0wsU0FBUyxHQUFHLGFBQWEsQ0FBQztZQUMxQixLQUFLLENBQUM7UUFDUixLQUFLLEVBQUU7WUFDTCxTQUFTLEdBQUcsYUFBYSxDQUFDO1lBQzFCLEtBQUssQ0FBQztJQUNSLENBQUM7SUFFRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUMsQ0FBQztBQUVGLElBQUksZUFBZSxHQUFHLFVBQVUsT0FBTztJQUNyQyxnREFBZ0Q7SUFDaEQsRUFBRSxDQUFDLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMvQixrQkFBa0IsR0FBRyxzQkFBc0IsRUFBRSxDQUFDO0lBQ2hELENBQUM7SUFFRCxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTO1FBQ2hCLE1BQU0sQ0FBQyxlQUFlO1FBQ3RCLE1BQU0sQ0FBQyxZQUFZO1FBQ25CLE1BQU0sQ0FBQyxXQUFXO1FBQ2xCLE1BQU0sQ0FBQyxVQUFVO1FBQ2pCLGtCQUFrQixDQUFDO0FBQzVCLENBQUM7QUFNQyx1QkFBZSxtQkFOZjtBQU9BIn0=