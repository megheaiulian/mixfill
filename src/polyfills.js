var Polyfills = {
	eventListener: {
		test: function(){
			var winProto = Window.prototype;
			return 'addEventListener' in winProto && 'removeEventListener' in winProto && 'dispatchEvent'
		}
	},
	promise : {
		test: function(){
			return 'Promise' in window
		}
	},
	elementMatches:{
		test:function(){
			if (Element){(function(ElementPrototype){
				ElementPrototype.matches = ElementPrototype.matchesSelector =
				ElementPrototype.matchesSelector || 
				ElementPrototype.webkitMatchesSelector ||
				ElementPrototype.mozMatchesSelector ||
				ElementPrototype.msMatchesSelector ||
				ElementPrototype.oMatchesSelector ||
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
	elementClassList:{
		test: function(){
			return "classList" in document.createElement("_")
		}
	}
	//,
	// yesop:{
	// 	test:function(){
	// 		return true
	// 	}
	// }
	// ,
	// needop:{
	// 	test :function(){
	// 		return false;
	// 	}
	// },
	// noop:{
	// 	test:function(){
	// 		return false
	// 	},
	// 	needs:['needop']

	// }
}
module.exports = Polyfills;