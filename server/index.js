var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	async = require('async'),
	fs = require('fs'),
	compression = require('compression');

// app.use('/test',express.static(__dirname + './../public'));

app.use(compression());

app.get('/',function(req,res,next){
	var query = req.query,
		fill = query.fill,fills=[];
	if(fill){
		fills = fill.split('-');
		async.map(fills,function(i,callback){
			fs.readFile(__dirname+"/min/"+i+".js",'utf8',function(err,data){
				callback(null,err?false:data);
			});
		},function(err,results){
			res.contentType("text/javascript");
			res.setHeader("Cache-Control", "public, max-age=345600");
			res.setHeader("Expires", new Date(Date.now() + 345600000).toUTCString());
			res.send(results.filter(Boolean).join(';'));
		});
	}else{
		res.send('')
	}
	//console.log(req.query);
	// res.send("A b");
});

app.listen(process.env.PORT || 5000);