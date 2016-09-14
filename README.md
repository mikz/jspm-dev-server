# JSPM Dev Server

HTTP/2 enabled server with support for [systemjs-hot-reloader](https://github.com/capaj/systemjs-hot-reloader).


## Usage

```shell
npm install jspm-dev-server --save-dev
openssl req -x509 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -days 30 -nodes -subj '/CN=localhost'
echo 'localhost.*' >> .gitignore
jspm-dev-server
```

Then just open `https://localhost:3000` and you'll see your app running. 

### Note for Windows git bash users

The openssl command above has to be modified to work on git bash on Windows. Please use this command instead:

`openssl req -x509 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -days 30 -nodes -subj '//CN=localhost'`

Notice the double slash in the -subj parameter. For more info see [this stack overflow answer](http://stackoverflow.com/a/31990313/2761797).

### Options

```

  Usage: jspm-dev-server [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -p, --port <n>       port to listen on. defaults to 3000
    -d, --dir <folder>   directory to serve static files from
    -c, --cert <pem>     path to a PEM certificate. defaults to localhost.crt in current folder
    -k, --key <pem>      path to a PEM key. defaults to localhost.key in current folder
    -i, --ignore <path>  paths to ignore from file watching
    -l, --proxy <url>    url to forward the request if file is not found

```

### Examples

If you have a Rails app and want to serve some assets over HTTP/2, you can use the proxy:

```shell
jspm-dev-server --port 3001 --proxy http://localhost:3000
```

If you need to serve different folder, than you are currently in, use the directory setting:

```shell
jspm-dev-server --dir static/
```

## TODO

- [x] configure which folder to serve
- [ ] ability to control the middleware
- [x] configurable paths to certs
- [x] configurable port
- [x] proxy to fallback server


## Projects

This project is using:

* [node-spdy](https://github.com/indutny/node-spdy)
* [chokidar-socket-emitter](https://github.com/capaj/chokidar-socket-emitter)
* [serve-static](https://github.com/expressjs/serve-static)
