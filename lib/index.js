'use strict';
var slug = require('slug');
var options = {
  separator: '-',
  slug: 'slug',
  fields: ['title']
};
module.exports = {
  middleware: function (Model, newdata, opt, cb) {
    if (opt instanceof Object) {
      for (var item in opt) {
        options[item] = opt[item];
      }
    } else if (opt instanceof Function) {
      cb = opt;
    }
    var strlug = '';
    options.fields.forEach(function (field) {
      strlug += options.separator + newdata[field];
    });
    strlug = slug(strlug.substr(1));
    var actualSlug = newdata[options.slug] || '';

    if (actualSlug.substr(0, actualSlug.lastIndexOf(options.separator)) === strlug) {//Para data existente
      actualSlug = strlug;
      cb(null);
    } else {
      actualSlug = strlug;
      Model.find({
        where: {
          slug: new RegExp('^' + strlug)
        }
      }, function (err, docs) {
        if (err) {
          cb(err);
        } else if (!docs.length) {
          cb(null);
        } else {
          var max = docs.reduce(function (mx, doc) {
            var docSlug = doc[options.slug];
            var count = 1;
            if (docSlug !== strlug) {
              count = docSlug.match(new RegExp(strlug + options.separator + '([0-9]+)$'));
              count = count instanceof Array ? parseInt(count[1]) : 0 + 1;
            }
            return count > mx ? count : mx;
          }, 0);
          if (max === 1) {
            actualSlug = strlug + options.separator + (max + 1);
            cb(null);
          } else if (max > 0) {
            actualSlug = strlug + options.separator + max;
            cb(null);
          } else {
            actualSlug = strlug;
            cb(null);
          }
        }
      });
    }
  }
};

