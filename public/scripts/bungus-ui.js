"use strict";

var BungusUI = function ($, createjs) {

	/********************************************/
	// Window Loaded and Document Ready
	/********************************************/

	function document_ready() {
		create_interactions();
	}

	function window_loaded() {}

	/********************************************/
	// UI	
	/********************************************/

	function create_interactions() {
		$(".nav-btn").click(function () {
			var $this = $(this);

			var paneId = $this.data("target-pane");

			alert(paneId);
		});
	}

	/********************************************/
	// Execute	
	/********************************************/

	//initialize on document ready
	$(window).load(document_ready);

	//remove loading screen
	$(window).load(window_loaded);

	//create interface
	return Object.freeze({});
}($, createjs);