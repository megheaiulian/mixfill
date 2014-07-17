var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	async = require('async'),
	fs = require('fs');

// app.use('/test',express.static(__dirname + './../public'));


app.get('/',function(req,res,next){
	var query = req.query,
		fill = query.fill,fills=[];
	if(fill){
		fills = fill.split('-');
		async.map(fills,function(i,callback){
			fs.readFile(__dirname+"/polyfills/"+i+".js",'utf8',function(err,data){
				if(err){
					callback(null,false)
				}else{
					callback(null,data);	
				}
				
			});
		},function(err,results){
			console.log(results);
			res.contentType("text/javascript");
			res.send(results.filter(Boolean).join(';'));
		});
	}else{
		res.send('')
	}
	//console.log(req.query);
	// res.send("A b");
});

app.listen(process.env.PORT || 5000);