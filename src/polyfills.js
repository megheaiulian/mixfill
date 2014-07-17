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