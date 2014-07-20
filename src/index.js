var polyfills = require('./detect'),
	loadScript = function(src,callback){
		var doc = document,
			s = doc.createElement('script');
		s.type = 'text/' + (src.type || 'javascript');
		s.src = src.src || src;
		s.async = false;

		s.onreadystatechange = s.onload = function () {

			var state = s.readyState;

			if (!callback.done && (!state || /loaded|complete/.test(state))) {
				callback.done = true;
				callback();
			}
		};

		// use body if available. more safe in IE
		(doc.body || doc.head).appendChild(s);
	};

var MixFill = function(path){

	var fill = this;
	
	fill.path = path,
	fill.needed  = []; 
	
	fill.needs = function(features){
		var self = this;
		features = features || [];

		for(var i=0; i<features.length; i++){
			var feature = features[i]
				, fill = polyfills[feature];
				
			if(fill && !fill.test()){
				if(fill.needs){
					self.needs(fill.needs);
				}
				self.needed.push(feature);
			}
		}
		return self;
	};

	fill.load = function(callback){
		var self = this,
			url = self.path,
			shims = self.needed;
		if(!(shims.length>0)){
			callback();
			return self;
		}
		for(var i=0;i<shims.length;i++){
			var shim = shims[i];
			url += shim +"-";
		}
		url = url.replace(/\-$/,'')
		url+=".js";
		loadScript(url,function(){
			callback()
		});
		return self;
	}
};
module.exports = MixFill;