var spdy = require('spdy'),
  fs = require('fs'),
  serveStatic = require('serve-static'),
  finalhandler = require('finalhandler'),
  httpProxy = require('http-proxy'),
  url    = require('url')

var dir = process.cwd()

var defaultOptions = {
  spdy: { }
}

var serverOptions = function(opts) {
  var keys = {
    key: fs.readFileSync(opts.key),
    cert: fs.readFileSync(opts.cert),
    ca: fs.readFileSync(opts.key)
  }
  return Object.assign({}, defaultOptions, opts, keys)
};


// Serve up public/ftp folder
var serveMiddleware = function(options) {
  return serveStatic(options.dir, {
    fallthrough: !!options.proxy,
    'index': ['index.html', 'index.htm'],
    'setHeaders': function(res, path, stat) {
      if (path.includes('/jspm_packages/')) {
        res.setHeader('Cache-Control', 'public, max-age=36000')
        res.setHeader('Expires',' Thu, 15 Apr 2020 20:00:00 GMT')
      } else {
        res.setHeader('Cache-Control', 'public, max-age=0')
      }
    }
  })
}

var proxy = httpProxy.createProxyServer({protocolRewrite: 'https:', autoRewrite: true});

module.exports = function(opts) {
  var options = serverOptions(opts || {})
  var serve = serveMiddleware(options)
  var target = options.proxy && url.parse(options.proxy)

  proxy.on('proxyReq', function(proxyReq, req, res, proxyOptions) {
    proxyReq.setHeader('X-Forwarded-Proto', 'https');
    console.log(`${req.method} https://${req.headers.host}${req.url} => ${options.proxy}`)
  })

  proxy.on('proxyRes', function(proxyRes, req, res, proxyOptions) {
    var location = proxyRes.headers['location']
    if (location) {
      var u = url.parse(location)
      u.host = target.host
      proxyRes.headers['location'] = url.format(u)
    }
  })

  var server = spdy.createServer(options, function(req, res) {
    var done = finalhandler(req, res)

    serve(req, res, options.proxy ? function() {
      proxy.web(req, res, { target: options.proxy }, done)
    } : done);
  });

  var chokidar = { app: server, dir: dir, chokidar: options.chokidar }
  require('chokidar-socket-emitter')(chokidar)

  return server
}
