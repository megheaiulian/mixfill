var express = require('express')
	, app = express()
	, compression = require('compression');

//Use gzip
app.use(compression());

/*
Add middleware for cache
*/
app.use(function(req,res,next){
	if(req.url.match(/\.js$/)){
		if(req.headers['user-agent'].indexOf("MSIE")){
			res.contentType('text/javascript');
		}
		res.setHeader("Cache-Control", "public, max-age=345600");
		res.setHeader("Expires", new Date(Date.now() + 345600000).toUTCString());
	}
	next();
});

//Server static
app.use(express.static('./public/shims'));
app.use(express.static('./public'));
app.use(express.static('./lib'));

app.listen(process.env.PORT || 5000);