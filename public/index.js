require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"mixfill":[function(require,module,exports){
module.exports=require('2genGb');
},{}],"2genGb":[function(require,module,exports){
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
},{"./load":3,"./tests":4}],3:[function(require,module,exports){
// yepnope.js
// v2.0.0
//
// by
// Alex Sexton - @slexaxton - alexsexton[at]gmail.com
// Ralph Holzmann - @rlph - ralphholzmann[at]gmail.com
//
// http://yepnopejs.com/
// https://github.com/SlexAxton/yepnope.js/
//
// New BSD
//
// Consider inlining this script after minifying

module.exports = (function (window, document, undef) {
  // Yepnope's style is intentionally very flat to aid in
  // minification. The authors are usually against too much
  // self-minification, but in the case of a script loader, we're
  // especially file size sensitive.

  // Some aliases
  var sTimeout = window.setTimeout;
  var firstScript;
  var count = 0;
  var toString = {}.toString;

  // This is just used for a race condition,
  // so even if it fails it's not a huge risk
  var isOldIE = !!document.attachEvent && !(window.opera && toString.call(window.opera) == '[object Opera]');

  var noop = function(){}

  // Helper functions
  var isObject = function(obj) {
    return Object(obj) === obj;
  }

  var isString = function(s) {
    return typeof s == 'string';
  }
  // Loader Utilities
  var uniq = function() {
    return 'mf_' + (count++);
  }

  var readFirstScript =  function() {
    if (!firstScript || !firstScript.parentNode) {
      firstScript = document.getElementsByTagName('script')[0];
    }
  }

  var isFileReady = function(readyState) {
    // Check to see if any of the ways a file can be ready are available as properties on the file's element
    return (!readyState || readyState == 'loaded' || readyState == 'complete' || readyState == 'uninitialized');
  }

  var runWhenReady = function(src, cb) {
      cb.call(window);
  }

  // Inject a script into the page and know when it's done
  var injectJs = function(options, cb) {
    var src;
    var attrs;
    var timeout;

    if (isString(options)) {
      src = options;
    }
    else if (isObject(options)) {
      // Allow rewritten url to take precedence
      src = options._url || options.src;
      attrs = options.attrs;
      timeout = options.timeout;
    }

    cb = cb || noop;
    attrs = attrs || {};

    var script = document.createElement('script');
    var done;
    var i;

    timeout = timeout || 10e3;

    script.src = src;

    // IE Race condition
    // http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
    if (isOldIE) {
      script.event = 'onclick';
      script.id = script.htmlFor = attrs.id || uniq();
    }

    // Add our extra attributes to the script element
    for (i in attrs) {
      script.setAttribute(i, attrs[i]);
    }

    // Bind to load events
    script.onreadystatechange = script.onload = function () {

      if ( !done && isFileReady(script.readyState) ) {
        // Set done to prevent this function from being called twice.
        done = 1;

        // Second half of IE race condition hack
        if (isOldIE) {
          try {
            // By calling this here, we create a synchronous
            // execution of the contents of the script
            // and the execution of the callback below.
            script.onclick();
          }
          catch (e) {}
        }

        // Just run the callback
        runWhenReady(src, cb);
      }

      // Handle memory leak in IE
      script.onload = script.onreadystatechange = script.onerror = null;
    };

    // This won't work in every browser, but
    // would be helpful in those that it does.
    // http://stackoverflow.com/questions/2027849/how-to-trigger-script-onerror-in-internet-explorer/2032014#2032014
    // For those that don't support it, the timeout will be the backup
    script.onerror = function () {
      // Don't call the callback again, so we mark it done
      done = 1;
      cb(new Error('Script Error: ' + src));
      // We don't waste bytes on cleaning up memory in error cases
      // because hopefully it doesn't happen often enough to matter.
      // And you're probably already in an 'uh-oh' situation.
    };

    // 404 Fallback
    sTimeout(function () {
      // Don't do anything if the script has already finished
      if (!done) {
        // Mark it as done, which means the callback won't run again
        done = 1;

        // Might as well pass in an error-state if we fire the 404 fallback
        cb(new Error('Timeout: ' + src));
        // Maybe...
        script.parentNode.removeChild(script);
      }
    }, timeout);

    // Inject script into to document
    readFirstScript();
    firstScript.parentNode.insertBefore(script, firstScript);
  }
  return injectJs;
})(window, document);
},{}],4:[function(require,module,exports){
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
},{}]},{},[]);