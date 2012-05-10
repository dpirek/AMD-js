(function(){
	
	// Gloab settings.
	var namespace = 'APP',
			filePath = 'js/',
			filePrefix = 'APP.';
	
	// Set app namespace.
	window[namespace] = {};
	
	// Script loader.
	var loadScript = function(key, sScriptSrc, callBack) {
	
		// Gets document head element.
		var oHead = document.getElementsByTagName('head')[0];
		if(oHead) {
		
			// Creates a new script tag		
			var oScript = document.createElement('script');
					
			// Adds src and type attribute to script tag.
			oScript.setAttribute('src', sScriptSrc);
			oScript.setAttribute('type','text/javascript');
	
			// Calling a function after the js is loaded (IE).
			var loadFunction = function() {
				if (this.readyState == 'complete' || this.readyState == 'loaded') {
					callBack(key); 
				}
			};
			
			oScript.onreadystatechange = loadFunction;
	
			// Calling a function after the js is loaded (Firefox).
			oScript.onload = function(){
				callBack(key);
			};
			
			// Append the script tag to document head element.
			oHead.appendChild(oScript);
		}
	};
	
	// For each, takes arrays and objects.
	var forEach = function(a, callBack){
	
		var length = a.length;
		
		// Object does not have .length propery.
		if(length) {
			for (var i = 0; i < length; i++){
	    	callBack(i, a[i]);
	    }
		} else {
			for (var key in a) {
				callBack(key, a[key]);
			}
		}
	};
	
	var handleDependencies = function(dependencies, callBack) {
		
		var _dependencies = [],
				length = dependencies.length,
				remoteModules = {},
				index = 0;
		
		// Check if dependancies were defind.
		if(length === 0) {
			callBack(_dependencies);
			return true;
		}
		
		// Check if dependancies exist, load them otherwise.
		forEach(dependencies, function(i, d){
			
			// Decide if dependancy is loaded.
			if(window[namespace][d]) {
				index++;
				_dependencies.push(APP[d]);
				if(length === index) {
					callBack(_dependencies);
				}
			} else {
				
				// TODO: sometimes there is overlap in dependancy loading, 
				// which causes wrong callback timing: fix.
				
				loadScript(d, filePath + filePrefix + d + '.js', function(key){
					index++;
					_dependencies.push(APP[key]);
					if(length === index) {
						callBack(_dependencies);
					}
				});
			}
		});
	};
	
	// Global 'define' AMD method.
	window.define = function(name, dependencies, callBack){
		handleDependencies(dependencies, function(d){
			window[namespace][name] = callBack.apply(this, d);
		});
	};
	
	// Global 'require' method.
	window.require = function(dependencies, callBack){
		handleDependencies(dependencies, function(d){
			callBack.apply(this, d);
		});
	};	
}());