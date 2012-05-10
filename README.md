AMD-js
======

Minimalistic implementation of javascript AMD

Example usage:

// Inline definition.
define('bar', [], function (bar) {
	return {
		method1: function (){
			return true;
		}
	};
});

// Require example.
require(['bar', 'foo', 'util'], function (b, f, u) {
	console.log(b);
	console.log(f);
	console.log(u);
});	