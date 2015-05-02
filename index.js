'use strict';

var url = require('url'),
    Promise = require('bluebird'),
    modRewrite = require('connect-modrewrite'),
    httpProxy = require('http-proxy'),
    format = require('util').format;

var defaultExts = require('./extensions');

exports = module.exports = function (options) {

  if (!options || typeof options !== 'object') {
    throw new Error('options object must be given');
  }

  if (!options.target || typeof options.target !== 'string') {
    throw new Error('options.target must be a string');
  }

  if (/^(http|https):\/\//.test(options.target) === false) {
    throw new Error('options.target must start with http:// or https://');
  }

  var additionalExts = options.extensions || [];

  if(!Array.isArray(additionalExts)) {
    throw new Error('options.extensions must be an array');
  }

  var additionalExts = options.extensions || [];

  var extensions = defaultExts.concat(additionalExts);

  var target = url.parse(options.target);

  var rewriter = Promise.promisify(modRewrite([
    format('!\\.%s$ /index.html [L]', extensions.join('|\\.'))
  ]));

  var proxy = httpProxy.createProxyServer({
    target: target.href
  });

  proxy.on('proxyReq', function(proxyReq) {
    proxyReq.setHeader('Host', target.host);
    proxyReq.setHeader('Authorization', '');
  });

  var proxyWeb = Promise.promisify(proxy.web, proxy);

  return function (req, res, next) {

    rewriter(req, res).then(function () {
      return proxyWeb(req, res);
    }).then(next, next);
  };
};

