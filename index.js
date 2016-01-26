var spdy = require('spdy'),
  fs = require('fs'),
  serveStatic = require('serve-static'),
  finalhandler = require('finalhandler')

var dir = process.cwd()

var defaultOptions = {
  spdy: {
    protocols: [ 'h2', 'spdy/3.1', 'http/1.1' ],
    plain: false,

    connection: {
      windowSize: 1024 * 1024, // Server's window size
    }
  }
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


module.exports = function(opts) {
  var options = serverOptions(opts || {})
  var serve = serveMiddleware(options)

  var server = spdy.createServer(options, function(req, res) {
    var done = finalhandler(req, res)
    serve(req, res, done)
  });

  var chokidar = { app: server, dir: dir, chokidar: options.chokidar }
  require('chokidar-socket-emitter')(chokidar)

  return server
}
