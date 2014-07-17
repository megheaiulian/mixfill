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
	}
}
module.exports = Polyfills;