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

## TODO

- [ ] configure which folder to serve
- [ ] ability to control the middleware
- [ ] configurable paths to certs
- [ ] configurable port
