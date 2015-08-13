var esTranspiler = require('broccoli-babel-transpiler');
var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var pkg = require('./package.json');

function transpile(tree, opts) {
  return esTranspiler(tree, {
    stage: 0,
    moduleIds: true,
    modules: opts.modules,
    loose: ['es6.modules'],

    // Transforms /index.js files to use their containing directory name
    getModuleId: function (name) {
      name = pkg.name + '/' + name;
      return name.replace(/\/index$/, '');
    },

    // Fix relative imports inside /index's
    resolveModuleSource: function (source, filename) {
      var match = filename.match(/(.+)\/index\.\S+$/i);

      // is this an import inside an /index file?
      if (match) {
        var path = match[1];
        return source
          .replace(/^\.\//, path + '/')
          .replace(/^\.\.\//, '');
      } else {
        return source;
      }
    }
  });
}

var js = transpile('lib', { modules: 'amd' });
var amd = concat(js, {
  inputFiles: [
    '**/*.js'
  ],
  outputFile: '/' + pkg.name + '.amd.js'
});

var full = concat(mergeTrees([
  new Funnel('bower_components/loader.js', {
    destDir: '/',
    include: ['loader.js']
  }),
  amd
]), {
  inputFiles: [
    'loader.js',
    pkg.name + '.amd.js'
  ],
  outputFile: '/' + pkg.name + '.js'
});


module.exports = mergeTrees([
  full,
  amd
]);
