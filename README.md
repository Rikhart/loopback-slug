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
    Publication.beforeSave=function(next,newdata) {
        loopbackslug.middleware(Publication,newdata,{
            fields:['title'],
            slug:"slug"
        },function(err){
            if(!err){
                next();
            }else{
             throw new Error(err);
            }
        });
    };
};

```
