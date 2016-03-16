'use strict';

var path = require('path');
var pluginError = require('plugin-error');
var log = require('plugin-log');
var through = require('through2');
var bump = require('bump-regex');
var semver = require('semver');

const PLUGIN_NAME = 'gulp-bump';

module.exports = function(opts) {

  opts = opts || {};
  if (!opts.type || !semver.inc('0.0.1', opts.type)) {
    opts.type = 'patch';
  }

  return through.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new pluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    opts.str = String(file.contents);
    bump(opts, function(err, res) {
      if (err) {
        return cb(new pluginError(PLUGIN_NAME, err));
      }
      file.contents = new Buffer(res);
      cb(null, file);
    });
  });
};
