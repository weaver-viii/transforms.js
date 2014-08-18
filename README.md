# Walker Transforms

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

For documentations, go to https://normalize.github.io/docs.html#transforms.

## Adding Transforms

Feel free to add transforms as long as they transform would be used
by a lot of people. In other words, please don't add transform for your
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

## Creating Custom Transforms

You might want to add your own transforms.
Feel free to fork this and use it as a replacement for `nlz(1)` or your app.
You may either fork and use your fork as a git dependency in your app:

```js
{
  "devDependencies": {
    "nlz": "1",
    "normalize-transforms": "jonathanong/transforms.js"
  }
}
```

Or you may publish it as a separate package and reference it in your `.nlzrc`:

```js
{
  "devDependencies": {
    "nlz": "1",
    "my-custom-transforms": "1"
  }
}
```

`.nlzrc`:

```js
{
  "transform": "my-custom-transforms"
}
```

When creating your own custom transform as your own package,
you don't have to fork this repository.
Instead, you can use this repository as a dependency
and bundle all the exported transforms like the exported `transform()` function: https://github.com/normalize/transforms.js/blob/master/lib/index.js

Caveat: if your transform function is a local file, prefix it with `./` so that
`nlz` knows that it's a local file. It will be resolved against `process.cwd()`.

[npm-image]: https://img.shields.io/npm/v/normalize-transforms.svg?style=flat-square
[npm-url]: https://npmjs.org/package/normalize-transforms
[github-tag]: http://img.shields.io/github/tag/normalize/transforms.js.svg?style=flat-square
[github-url]: https://github.com/normalize/transforms.js/tags
[travis-image]: https://img.shields.io/travis/normalize/transforms.js.svg?style=flat-square
[travis-url]: https://travis-ci.org/normalize/transforms.js
[coveralls-image]: https://img.shields.io/coveralls/normalize/transforms.js.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/normalize/transforms.js?branch=master
[david-image]: http://img.shields.io/david/normalize/transforms.js.svg?style=flat-square
[david-url]: https://david-dm.org/normalize/transforms.js
[license-image]: http://img.shields.io/npm/l/normalize-transforms.svg?style=flat-square
[license-url]: LICENSE.md
[downloads-image]: http://img.shields.io/npm/dm/normalize-transforms.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/normalize-transforms
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
