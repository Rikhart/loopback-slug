'use strict';
var slug = require('slug');
var options = {
  separator: '-',
  slug: 'slug',
  fields: ['title'],
  lowercase: true
};
module.exports = {
  middleware: function middleware(Model, ctx, opt, cb) {
    var auxdata = ctx.instance || ctx.data;
    function make(newdata) {
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
      if (options.lowercase) {
        strlug = strlug.toLowerCase();
      }
      newdata[options.slug] = newdata[options.slug] || '';
      var iof = newdata[options.slug].lastIndexOf(options.separator) == -1 ? newdata[options.slug].length : newdata[options.slug].lastIndexOf(options.separator);
      if (newdata[options.slug].substr(0, iof) == strlug && newdata[options.slug].length) {
        newdata[options.slug] = newdata[options.slug];
        return cb(null);
      } else {
        newdata[options.slug] = strlug;
        var obj = {};
        obj[options['slug']] = new RegExp('^' + strlug + '($|' + options.separator + ')');
        Model.find({
          where: obj
        }, function (err, docs) {
          if (err) {
            cb(err);
          } else if (!docs.length) {
            cb(null);
          } else {
            var max = docs.reduce(function (mx, doc) {
              var docSlug = doc[options.slug];
              var count = 1;
              if (docSlug != strlug) {
                count = docSlug.match(new RegExp(strlug + options.separator + '([0-9]+)$'));
                count = (count instanceof Array ? parseInt(count[1]) : 0) + 1;
              }
              return count > mx ? count : mx;
            }, 0);

            if (max == 1) {
              newdata[options.slug] = strlug + options.separator + (max + 1);
              cb(null);
            } else if (max > 0) {
              newdata[options.slug] = strlug + options.separator + max;
              cb(null);
            } else {
              newdata[options.slug] = strlug;
              cb(null);
            }
          }
        });
      }
    }
    var band = false;
    if (ctx.currentInstance) {
      if (ctx.currentInstance.id) {
        band = true;
      }
    }
    if (band) {
      Model.findOne({
        where: {
          id: ctx.currentInstance.id
        }
      }, function (err, data) {
        if (err) return cb(err);
        if (!data) return cb(auxdata);
        auxdata[options.slug] = data[options.slug];
        make(auxdata);
      });
    } else {
      make(auxdata);
    }
  }
};