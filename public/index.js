require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"mixfill":[function(require,module,exports){
module.exports=require('2genGb');
},{}],"2genGb":[function(require,module,exports){
var polyfills = require('./polyfills'),
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
			var feature = features[i],
				fill = polyfills[feature];
			console.log(fill);
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
			url = self.path+'?fill=',
			shims = self.needed;
		for(var i=0;i<shims.length;i++){
			var shim = shims[i];
			url += shim +"-";
		}
		url = url.replace(/\-$/,'')
		loadScript(url,function(){
			callback()
		});
		return self;
	}
};
module.exports = MixFill;
},{"./polyfills":3}],3:[function(require,module,exports){
var Polyfills = {
	eventListener: {
		test: function(){
			var winProto = window.prototype;
			return 'addEventListener' in winProto && 'removeEventListener' in winProto && 'dispatchEvent'
		}
	},
	promise : {
		test: function(){
			return 'Promise' in window
		}
	},
	yesop:{
		test:function(){
			return true
		}
	}
	,
	needop:{
		test :function(){
			return false;
		}
	},
	noop:{
		test:function(){
			return false
		},
		needs:['needop']

	}
}
module.exports = Polyfills;
},{}]},{},[]);