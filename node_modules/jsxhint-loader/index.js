var jshintLoader = require("jshint-loader");
var reactTools = require('react-tools');
var loaderUtils = require('loader-utils');

module.exports = function(source) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  if (query.insertPragma) {
    source = '/** @jsx ' + query.insertPragma + ' */' + source;
  }
  var transform = reactTools.transformWithDetails(source, {
    harmony: query.harmony,
    es5: query.es5
  });

  // all the query information were only meant for the jsx-compiler
  this.query = '';
  jshintLoader.call(this,transform.code);
}
