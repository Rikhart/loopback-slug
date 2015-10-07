# loopback-slug [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> slugyfy your properties


# loopback-slug

url friendly generator for loopback.io framework.

[![build status](https://raw.githubusercontent.com/Rikhart/loopback-slug/master/dicko.png)](http://travis-ci.org/rikhart/loopback-slug)

## Installation

This module is installed via npm:

``` bash
$ npm install loopback-slug
or
$ npm install git://github.com/rikhart/loopback-slug.git
```

## Example Usage
Edit the /common/models/name_of_your_models.js and add a hook method.
Use the hook "beforeSave" method to add the functionality, pass the Model,newdata,and the configoptions.

## Configoptions:(json object)
* **separator** (Default: '-') - Separator to use for characters.
* **slug** (Default: 'slug') - Parts that are uploaded simultaneously.
* **fields** (Default: 'title') - Array that will use to form the slug.

``` js
var loopbackslug=require("loopback-slug");
module.exports = function(Publication) {
    Publication.observe('before save', function updateTimestamp(ctx, next) {
      loopbackslug.middleware(Publication,this,{
          fields:['title'],
          slug:"slug"
      },function(err){
          if(err) return cb(err)
          else cb(null);
      });    
    });    
};

```

## License

Apache-2.0 © [Dick Van Ocampo Davila]()


[npm-image]: https://badge.fury.io/js/loopback-slug.svg
[npm-url]: https://npmjs.org/package/loopback-slug
[travis-image]: https://travis-ci.org/rikhart/loopback-slug.svg?branch=master
[travis-url]: https://travis-ci.org/rikhart/loopback-slug
[daviddm-image]: https://david-dm.org/rikhart/loopback-slug.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/rikhart/loopback-slug
[coveralls-image]: https://coveralls.io/repos/rikhart/loopback-slug/badge.svg
[coveralls-url]: https://coveralls.io/r/rikhart/loopback-slug
