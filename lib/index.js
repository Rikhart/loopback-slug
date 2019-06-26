'use strict';
var slug = require('slugify');
var options = {
  separator: '-',
  slug: 'slug',
  fields: ['title'],
  lowercase: true
};
module.exports = {
  middleware: function (Model, ctx, opt, cb) {
    var auxdata = ctx.instance || ctx.data;
    if (opt instanceof Object) {
      for (var item in opt) {
        options[item] = opt[item];
      }
    } else if (opt instanceof Function) {
      cb = opt;
    }
    function make(newdata) {
      var slugify = function (str) {
        var from = "ąàáäâãåæćęèéëêìíïîłńòóöôõøśùúüûñçżź",
          to = "aaaaaaaaceeeeeiiiilnoooooosuuuunczz",
          regex = new RegExp('[' + from.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1') + ']', 'g');

        if (str == null) return '';

        str = String(str).toLowerCase().replace(regex, function (c) {
          return to.charAt(from.indexOf(c)) || options.separator;
        });
        return str.replace(/[^\w\s-]/g, '').replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, options.separator).toLowerCase();
      }

      var strlug = '';
      options.fields.forEach(function (field) {
        strlug += options.separator + newdata[field];
      });

      // fix
      var startAt = options.separator.length;
      if (startAt == 0) {
        strlug = strlug.replace(' ', '');
      }
      strlug = slug(strlug.substr(startAt), options.separator);

      if (options.lowercase) {
        strlug = strlug.toLowerCase();
      }
      strlug = slugify(strlug);
      newdata[options.slug] = newdata[options.slug] || '';
      var iof = (newdata[options.slug].lastIndexOf(options.separator) == -1) ? (newdata[options.slug].length) : (newdata[options.slug].lastIndexOf(options.separator));
      //Para cadenas largas comprobacion
      function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
      }
      var isNumber = isNumber(parseInt(newdata[options.slug].substr(iof + 1, newdata[options.slug].length)));
      if (!isNumber) iof = newdata[options.slug].length;
      //Deficiencia si la cadena tiene un numero al final.
      if (newdata[options.slug].substr(0, iof) == strlug && newdata[options.slug].length) {
        newdata[options.slug] = newdata[options.slug];
        return cb(null);
      } else {
        newdata[options.slug] = strlug;
        var obj = {};
        strlug = strlug.replace(/[^\w\s]/gi, '');
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
            } else if (max > 0) {
              newdata[options.slug] = strlug + options.separator + max;
            } else {
              newdata[options.slug] = strlug;
            }
            ctx.currentInstance = newdata;
            cb(null);
          }
        });
      }
    }
    var band = false;
    for (var field of options.fields) {
      if (!auxdata[field]) return cb(null)
    }
    if (ctx.currentInstance) {
      if (ctx.currentInstance.id) {
        band = true;
      } else {
        auxdata = ctx.currentInstance;
        return make(auxdata);
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
        data = data.__data;
        for (var i in data) {
          if (!auxdata[i]) {
            if (data.hasOwnProperty(i))
              auxdata[i] = data[i];
          }
        }
        auxdata[options.slug] = data[options.slug];
        make(auxdata);
      })
    } else {
      if (auxdata.id) {
        Model.findOne({
          where: {
            id: auxdata.id
          }
        }, function (err, data) {
          if (err) return cb(err);
          if (!data) return cb(auxdata);
          data = data.__data;
          for (var i in data) {
            if (!auxdata[i]) {
              if (data.hasOwnProperty(i))
                auxdata[i] = data[i];
            }
          }
          auxdata[options.slug] = data[options.slug];
          make(auxdata);
        })
      } else {
        make(auxdata);
      }
    }
  }
};
