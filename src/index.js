var tests = require('./tests') 
	, isArray = function(obj){return Object.prototype.toString.call( obj ) === '[object Array]'}
	, isFunction = function(obj){return !!(obj && obj.constructor && obj.call && obj.apply)}
	, doc = document
	, head = doc.getElementsByTagName("head")[0] || doc.documentElement
	, loadScript = function(src,cb){
		var script = doc.createElement('script')
			, done
			, ready = function(err){ if(cb) cb(err);};

		script.src 		= src;
		script.async 	= true;

		script.onload = script.onreadystatechange = function () {
			if(!done && (!script.readyState || /loaded|complete/.test( script.readyState ))){
				done = 1;
				script.onload = script.onreadystatechange = null;
				if(script.parentNode){
				 	script.parentNode.removeChild(script);
				}
				script = null;
				ready();
			}
		};
		script.onerror = function(){
			done = 1;
			ready(new Error('Script Error: ' + src));
		};
		setTimeout(function(){
			if(!done){
				done = 1;
				ready(new Error('Timeout: ' + src));
			}
		},10e3);
		head.insertBefore(script,head.firstChild);
	};

var MixFill = function(base){

	var that = this;
	
	that.base = base;
	that.tests = tests;
	that._need = {};

	that.setBase = function(base){
		var self = this;
		self.base = base;
		return self;
	};
	
	that.all = function(cb){
		var self = this,tests=self.tests,all=[];
		for(var test in tests){
			if(tests.hasOwnProperty(test)){
				all.push(test);
			}
		}
		return self.need(all).load(cb);
	};

	that.need = function(features){
		var self = this,i, tests = self.tests;
		if(features){
			features = !isArray(features)?[features]:features;
			for(i=0; i < features.length; i++){
				var feature = features[i]
					, ok = tests[feature];
				if(ok && !(ok = tests[feature] = (isFunction(ok)?Boolean(ok()):ok))){
					self._need[feature] = true;
				}
			}
		}
		return self;
	};

	that.load = function(cb){
		var self = this
			, url = self.base
			, need = self._need
			, tests = self.tests
			, shims = []
			, fn = function(err){
				if(cb) cb(err);
				return self;
			}
		
		if(need){
			for(var shim in need){
				if(need.hasOwnProperty(shim) && need[shim]){
					shims.push(shim);
				}
			}
			if(!shims.length){
				return fn();
			}
			shims.sort();
			url = url.replace(/\/$/,'')+ "/" + shims.join("-")+'.js';
			loadScript(url,function(err){
				if(!err){
					self._need = {};
					for(var i=0;i<shims.length;i++){
						if(tests[shims[i]]){
							delete tests[shims[i]];
						}
					}
				}
				fn(err);
			});
		}else{
			fn()
		}
		return self;
	}
};
module.exports = MixFill;