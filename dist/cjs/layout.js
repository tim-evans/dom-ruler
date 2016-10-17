"use strict";
var styles_1 = require("./styles");
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
    var boxSizing = styles_1.detectBoxSizing(element);
    var clientRect = element.getBoundingClientRect();
    var content = {
        top: clientRect.top,
        left: clientRect.left,
        bottom: clientRect.bottom,
        right: clientRect.right,
        width: clientRect.width,
        height: clientRect.height
    };
    var styles = styles_1.getStyles(element);
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
exports.getLayout = getLayout;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGF5b3V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx1QkFBMkMsVUFBVSxDQUFDLENBQUE7QUFFdEQ7O0dBRUc7QUFDSCxJQUFJLGVBQWUsR0FBRyxVQUFVLE1BQU07SUFDcEMsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDdEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBRUYsSUFBSSxlQUFlLEdBQUcsVUFBVSxNQUFNO0lBQ3BDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDOUIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUVoQyw2REFBNkQ7SUFDN0QsTUFBTSxDQUFDO1FBQ0wsS0FBSyxFQUFNLEtBQUs7UUFDaEIsTUFBTSxFQUFLLE1BQU07UUFDakIsU0FBUyxFQUFFLElBQUk7UUFDZixPQUFPLEVBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7UUFDM0MsT0FBTyxFQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO1FBQzNDLE9BQU8sRUFBSTtZQUNULEtBQUssRUFBRyxNQUFNLENBQUMsVUFBVTtZQUN6QixNQUFNLEVBQUUsTUFBTSxDQUFDLFdBQVc7U0FDM0I7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsSUFBSSxpQkFBaUIsR0FBRyxVQUFVLFFBQVE7SUFDeEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FDbEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQy9ELFFBQVEsQ0FBQyxJQUFJ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