require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Polyfills = {
	elementClassList:{
		test: function(){
			return "classList" in document.createElement("_")
		}
	},
	elementMatches:{
		test:function(){
			if (Element){(function(proto){
				proto.matches = proto.matchesSelector =
				proto.matchesSelector || 
				proto.webkitMatchesSelector ||
				proto.mozMatchesSelector ||
				proto.msMatchesSelector ||
				proto.oMatchesSelector ||
				function (selector) {
					var nodes = (this.parentNode || this.document).querySelectorAll(selector), i = -1;
			 
					while (nodes[++i] && nodes[i] !== this);
			 
					return !!nodes[i];
				};
				})(Element.prototype);
			}
			return true;
		}
	},
	es5:{
		test:function(){
			var arrayProto = Array.prototype
				, dateProto = Date.prototype
				, stringProto = String.prototype;
			return arrayProto.every && arrayProto.filter && arrayProto.forEach && arrayProto.indexOf && arrayProto.lastIndexOf
				&& arrayProto.map && arrayProto.some && arrayProto.reduce && arrayProto.reduceRight && Array.isArray && Date.now &&
				Date.parse && dateProto.toJSON && dateProto.toISOString && Function.prototype.bind && Number.prototype.toFixed &&
				Object.keys && stringProto.split && stringProto.trim && stringProto.replace;
		}
	},
	es5Object:{
		test:function(){
			var obj = Object;
			return obj.create && obj.getPrototypeOf && obj.getOwnPropertyNames && obj.isSealed && obj.isFrozen &&
				obj.isExtensible && obj.getOwnPropertyDescriptor && obj.defineProperty && obj.defineProperties &&
				obj.seal && obj.freeze && obj.preventExtensions;
		}
	},
	eventListener: {
		test: function(){
			var winProto = window.prototype;
			return 'addEventListener' in winProto && 'removeEventListener' in winProto && 'dispatchEvent' in winProto
		}
	},
	promise : {
		test: function(){
			return 'Promise' in window
		}
	}
}
module.exports = Polyfills;
},{}],"2genGb":[function(require,module,exports){
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
		(doc.body || doc.head || doc.getElementsByTagName("head")[0]).appendChild(s);
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
},{"./detect":1}],"mixfill":[function(require,module,exports){
module.exports=require('2genGb');
},{}]},{},[]);