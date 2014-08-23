var Tests = {
	elementClassList: function(){
		return "classList" in document.createElement("_")
	},
	elementMatches: function(){
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
	},
	es5: function(){
		var arrayProto = Array.prototype
			, dateProto = Date.prototype
			, stringProto = String.prototype;
		return (arrayProto.every && arrayProto.filter && arrayProto.forEach && arrayProto.indexOf && arrayProto.lastIndexOf
			&& arrayProto.map && arrayProto.some && arrayProto.reduce && arrayProto.reduceRight && Array.isArray && Date.now &&
			Date.parse && dateProto.toJSON && dateProto.toISOString && Function.prototype.bind && Number.prototype.toFixed &&
			Object.keys && stringProto.split && stringProto.trim && stringProto.replace);
	},
	es5Object: function(){
		var obj = Object;
		return obj.create && obj.getPrototypeOf && obj.getOwnPropertyNames && obj.isSealed && obj.isFrozen &&
			obj.isExtensible && obj.getOwnPropertyDescriptor && obj.defineProperty && obj.defineProperties &&
			obj.seal && obj.freeze && obj.preventExtensions;
	},
	eventListener: function(){
		var win = window
			, Win = win['Window']
			, winProto = Win?Win.prototype:win;
		return 'addEventListener' in winProto && 'removeEventListener' in winProto && 'dispatchEvent' in winProto
	},
	promise : function(){
		return 'Promise' in window
	}
}
module.exports = Tests;