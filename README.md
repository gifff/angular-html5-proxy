# angular-html5-proxy

  Simple express proxy middleware for angular html5mode

  [![NPM Version][npm-image]][npm-url]
  [![Build Status][travis-image]][travis-url]

```js
var express = require('express'),
    proxy = require('angular-html5-proxy');

app.use(proxy({
  target: 'http://my-angular.static-server.com' 
}));

app.listen(3000);
```

## What is this?

  From the angular docs about html5mode

  > #### Server side 
  > 
  > Using this mode requires URL rewriting on server side,
  > basically you have to rewrite all your links to entry point of your application (e.g. index.html).
  
  This is the server side! angular-html-proxy rewrites url of each request and sends it to the original static server.

## Installation

```bash
$ npm install angular-html5-proxy
```

## Example

  Here is a simple server implemetation using angular-html5-proxy:
  [angular-simple-server](https://github.com/gifff/angular-simple-server)

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License

  [MIT](LICENSE)
  
[npm-image]: https://img.shields.io/npm/v/angular-html5-proxy.svg
[npm-url]: https://npmjs.org/package/angular-html5-proxy
[travis-image]: https://travis-ci.org/gifff/angular-html5-proxy.svg?branch=master
[travis-url]: https://travis-ci.org/gifff/angular-html5-proxy
