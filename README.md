# Walker Transforms

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
