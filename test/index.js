var expect = require('chai').expect,
    loopbackSlug = require('..');

describe('loopback-slug', function() {
  it('should say hello', function(done) {
    expect(loopbackSlug.middleware({},{
	req:{
		body:{
			name:"juan;anles",
			lastname:"jose#"		
		}	
	}	
	},['name','lastname'])).to.equal('Hello, world');
    done();
  });
});
