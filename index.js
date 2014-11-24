var slug = require('slug');
var options = {
    separator: "-",
    slug:"slug",
    fields:["title"]
}
module.exports = {
    middleware: function (Model, newdata, opt, cb) {
        if(options instanceof Object){
            for(var item in opt){
                options[item]=opt[item];
            }
        }else if(options instanceof Function ){
            cb=opt;
        }
        var strlug = "";
        options.fields.forEach(function (field) {
            strlug += "-" + newdata[field];
        });
        strlug = slug(strlug.substr(1));
        if (newdata[options.slug].substr(0,item.lastIndexOf(options.separator))==strlug) {
            newdata[options.slug] = strlug;
            cb(null);
        } else {
            newdata.slug = strlug;
            Model.find({
                where: {
                    slug: new RegExp('^' + strlug)
                }
            }, function (err, docs) {
                if (err) {
                    cb(err);
                }
                else if (!docs.length) cb(null);
                else {
                    var max = docs.reduce(function (max, doc) {
                        var docSlug = doc[options.slug];
                        var count = 1;
                        if (docSlug != strlug) {
                            count = docSlug.match(new RegExp(strlug + options.separator + '([0-9]+)$'));
                            count = ((count instanceof Array) ? parseInt(count[1]) : 0) + 1;
                        }
                        return (count > max) ? count : max;
                    }, 0);
                    if (max == 1){
                        newdata[options.slug]=strlug + options.separator + (max + 1);
                        cb(null)
                    }//since slug-2
                    else if (max > 0){
                        newdata[options.slug]=strlug + options.separator + max;
                        cb(null);
                    }
                    else{
                        newdata[options.slug]=strlug;
                        cb(null);
                    }
                }
            })
        }
    }
};

