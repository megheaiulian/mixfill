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
			var winProto = Window?Window.prototype:window;
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