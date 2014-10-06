var compileES6 = require('broccoli-es6-concatenator');
var mergeTrees = require('broccoli-merge-trees');
var uglifyJs = require('broccoli-uglify-js');
var moveFile = require('broccoli-file-mover');

var lib = compileES6(mergeTrees(['lib', 'bower_components/loader.js']), {
  loaderFile: 'loader.js',
  inputFiles: [
    '**/*.js'
  ],
  wrapInEval: false,
  outputFile: '/dom-ruler.js'
});

var amd = compileES6('lib', {
  inputFiles: [
    '**/*.js'
  ],
  wrapInEval: false,
  outputFile: '/dom-ruler.amd.js'
});

var uglify = function (tree, filename) {
  var minFilename = filename.split('.');
  minFilename.pop();
  minFilename.push('min', 'js');
  return uglifyJs(moveFile(tree, {
    srcFile: '/' + filename,
    destFile: '/' + minFilename.join('.')
  }));
}

module.exports = mergeTrees([
  lib,
  uglify(lib, 'dom-ruler.js'),
  amd,
  uglify(amd, 'dom-ruler.amd.js')
]);
