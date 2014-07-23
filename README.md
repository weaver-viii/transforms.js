# Walker Transforms

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]

For documentations, go to https://normalize.github.io/docs.html#transforms.

## Opting Out of Transforms

## Adding Transforms

Feel free to add transforms as long as they transform would be used
by a lot of people. In other words, don't add transform for your
brand new templating system.

Transforms here are a little odd due to the weird upstream/downstream
nature of the middleware as well as the additional responsibilities
transforms have, specifically handling dependencies.
If you don't know what you're doing, add a lot of tests and `debug()` statements!

Please lazy-load all external modules unless they're very small.
This will help with faster initial load times as well as not throw
if the end user doesn't have it installed. Also, your underlying
transform library should __not__ be included in `dependencies`
and instead `devDependencies`.

## Forking

You might want to remove some transforms or add your own.
Feel free to fork this and use it as a replacement for `nlz(1)` or your app.

[npm-image]: https://img.shields.io/npm/v/normalize-transforms.svg?style=flat
[npm-url]: https://npmjs.org/package/normalize-transforms
[travis-image]: https://img.shields.io/travis/normalize/transforms.js.svg?style=flat
[travis-url]: https://travis-ci.org/normalize/transforms.js
[coveralls-image]: https://img.shields.io/coveralls/normalize/transforms.js.svg?style=flat
[coveralls-url]: https://coveralls.io/r/normalize/transforms.js?branch=master
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat
[gittip-url]: https://www.gittip.com/jonathanong/
