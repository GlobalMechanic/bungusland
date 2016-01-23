"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BungusLoad = function ($, createjs) {

	var preload = undefined;

	var TRANSITION_EVENT = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";

	/********************************************/
	// Initialize
	/********************************************/

	function initialize() {
		create_preload_queue();
	}

	/********************************************/
	// Webload
	/********************************************/

	function hide_loading_screen() {
		$("#main-webload").addClass("transition-1s").addClass("preload-complete").one(TRANSITION_EVENT, function () {
			$(this).remove();
		});

		$("#main-content").show();
	}

	/********************************************/
	// Preload
	/********************************************/

	function create_preload_queue() {
		preload = new createjs.LoadQueue(true);
		preload.on("fileload", file_loaded);
		preload.on("fileprogress", file_progress);
		preload.on("error", file_error);
		preload.setMaxConnections(10);
	}

	/********************************************/
	// Preload Handlers
	/********************************************/

	function file_loaded(ev) {
		var image = ev.result;
		console.log(image, ev);
	}

	function file_progress() {}

	function file_error() {}

	/********************************************/
	// Loader Icon
	/********************************************/

	var LoaderIcon = function LoaderIcon() {
		_classCallCheck(this, LoaderIcon);
	};

	/********************************************/
	// Interface
	/********************************************/

	function load_image(url) {
		preload.loadFile(url);
	}

	function load_html() {}

	/********************************************/
	// Execute	
	/********************************************/

	//initialize on document ready
	$(document).ready(initialize);

	//remove loading screen
	$(window).load(hide_loading_screen);

	//create interface
	return Object.freeze({
		get image() {
			return load_image;
		},
		get html() {
			return load_html;
		}
	});
}(jQuery, createjs);