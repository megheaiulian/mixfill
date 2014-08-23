var tests = require('./tests') 
	, isArray = function(obj){return Object.prototype.toString.call( obj ) === '[object Array]'}
	, isFunction = function(obj){return !!(obj && obj.constructor && obj.call && obj.apply)}
	, loadScript = require('./load');

var MixFill = function(base){

	var that = this;
	
	that.base = base;
	that.tests = tests;
	that._need = {};
	
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
		var self = this,
			url = self.base,
			need = self._need,
			tests = self.tests,
			shims = [];
		
		if(need){
			for(var shim in need){
				if(need.hasOwnProperty(shim) && need[shim]){
					shims.push(shim);
				}
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
				cb(err);
			});
		}else{
			cb()
			return;
		}
	}
};
module.exports = MixFill;