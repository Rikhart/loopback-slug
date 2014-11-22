var slug = require('slug');
module.exports = {
    middleware:function(Model,ctx,fields){
	var body=ctx.req.body;
	var strlug="";
	fields.forEach(function(field){
		strlug+="-"+body[field];
	})
	strlug=slug(strlug.substr(1));
	console.log(strlug)
	Model.find({
		where:{
		 slug:new RegExp('^'+strlug)
		}
        
	},function(err,docs){
	  if(err){
		throw(err)
	  }
	 else if (!docs.length) cb(null, true, slug);
         else {
          var max = docs.reduce(function (max, doc) {
            var docSlug = doc.get(options.field, String);
            var count = 1;
            if (docSlug != slug) {
              count = docSlug.match(new RegExp(slug + options.separator + '([0-9]+)$'));
              count = ((count instanceof Array)? parseInt(count[1]) : 0) + 1;
            }
            return (count > max)? count : max;
          }, 0);
          if (max == 1) cb(null, false, slug + options.separator + (max + 1)); // avoid slug-1, rather do slug-2
          else if (max > 0) cb(null, false, slug + options.separator + max);
          else cb(null, false, slug);
         }	  
	})
	return 'Hello, world';
    }
};
