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