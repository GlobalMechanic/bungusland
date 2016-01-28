"use strict";

~function($){

	const TRANSITION_EVENT = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";
	const VIMEO_URL = "https://player.vimeo.com/video/";
	const VIMEO_OPT = "?color=e29f9f&title=0&byline=0&portrait=0";
	const BEHIND_THE_SCENES_URLS = [
		"content/behind_the_scenes_banner_redux.jpg",
		"content/behind_the_scenes_bathroom.jpg",
		"content/behind_the_scenes_batter_up.jpeg",
		"content/behind_the_scenes_bean_ani_fr_6.jpg",
		"content/behind_the_scenes_bg_sacn_blur.jpg",
		"content/behind_the_scenes_biggest_bean_image.jpg",
		"content/behind_the_scenes_billy_and_friends_in_a_dinghy.png",
		"content/behind_the_scenes_billy_in_mayors_chair.jpg",
		"content/behind_the_scenes_billy_live_performance.jpg",
		"content/behind_the_scenes_billy_mushroom_tongue.jpeg",
		"content/behind_the_scenes_billy_sea_cucumber_girl_clour_scheme.jpg",
		"content/behind_the_scenes_billyand_scg_in_front_of_BT.jpg",
		"content/behind_the_scenes_bionic_crab_new.jpg",
		"content/behind_the_scenes_bus_colored.jpg",
		"content/behind_the_scenes_carp_Diem.jpg",
		"content/behind_the_scenes_cover_park.jpg",
		"content/behind_the_scenes_cracked_mate.jpeg",
		"content/behind_the_scenes_crane_bg.jpg",
		"content/behind_the_scenes_crazy_prof_lair_bg.jpg",
		"content/behind_the_scenes_crazy_prof_mixing.jpg",
		"content/behind_the_scenes_crazy_prot_bold_line_shirt.jpg",
		"content/behind_the_scenes_cucumber_brain_drill.jpeg",
		"content/behind_the_scenes_cucumber_in_peril.jpg",
		"content/behind_the_scenes_drums_colored.jpg",
		"content/behind_the_scenes_emily_epiglotis_0001.jpg",
		"content/behind_the_scenes_emily_epiglottis_new_look.jpg",
		"content/behind_the_scenes_find_your_porpoise_new.jpg",
		"content/behind_the_scenes_gastronaut_bagel_landing.jpg",
		"content/behind_the_scenes_guitar_color.jpg",
		"content/behind_the_scenes_IMG_0266.JPG",
		"content/behind_the_scenes_jelly_fish_and_ice_cream_copy.jpg",
		"content/behind_the_scenes_just_billy.jpg",
		"content/behind_the_scenes_kawaii_bungus.jpg",
		"content/behind_the_scenes_keyboard_color.jpg",
		"content/behind_the_scenes_laboratory_w_walrus.jpg",
		"content/behind_the_scenes_lobsquitch_bold_line.jpg",
		"content/behind_the_scenes_logo_character_group_square.jpg",
		"content/behind_the_scenes_logo_character_group.jpg",
		"content/behind_the_scenes_magellephant.jpg",
		"content/behind_the_scenes_map.jpg",
		"content/behind_the_scenes_mayors_office.jpg",
		"content/behind_the_scenes_meet_the_lobsquitch.jpeg",
		"content/behind_the_scenes_merch_stand_colored.jpg",
		"content/behind_the_scenes_mobile_001.jpg",
		"content/behind_the_scenes_montage.jpg",
		"content/behind_the_scenes_New_logo_on_Transparancy.jpg",
		"content/behind_the_scenes_New_look_crazy_Prof.jpg",
		"content/behind_the_scenes_obese_Billy.jpeg",
		"content/behind_the_scenes_pain_in_the_neck_image.jpg",
		"content/behind_the_scenes_pep_diab_image.jpg",
		"content/behind_the_scenes_prawn_paul_still_wide.jpg",
		"content/behind_the_scenes_reac_for_cuc_T_shirt.jpg",
		"content/behind_the_scenes_romantic_dinner.jpg",
		"content/behind_the_scenes_sc_Juice.jpg",
		"content/behind_the_scenes_scG_front_veiw.jpg",
		"content/behind_the_scenes_sea_cuc_annie_fr_21.jpg",
		"content/behind_the_scenes_sea_cuc_chocs_blu.jpg",
		"content/behind_the_scenes_sea_cuc_leg.jpeg",
		"content/behind_the_scenes_sea_cuc_robo_suit.jpg",
		"content/behind_the_scenes_sea_cuc_t-shirt.jpg",
		"content/behind_the_scenes_signing_color.jpg",
		"content/behind_the_scenes_suburb.jpg",
		"content/behind_the_scenes_sushi_monsters.jpg",
		"content/behind_the_scenes_tail_of_a_whale_picture.jpg",
		"content/behind_the_scenes_towwer.jpg",
		"content/behind_the_scenes_trees.jpg",
		"content/behind_the_scenes_vomitus.jpg",
		"content/behind_the_scenes_you_are_here.jpeg"
	]

	var $scroll_content, $fixed_content, $modal;
	var $welcome_nav, $videos_nav, $music_nav, $music_portrait_island, $top_islands;
	var loaded_panes = new Set();

	var $carousel = null;
	var $music;

	var SCWidget = null, audio, audio_should_be_paused = false;

	/********************************************/
	// Page Events
	/********************************************/

	function get_references()
	{
		$scroll_content = $("#scroll-content");
		$fixed_content = $("#fixed-content");
		$welcome_nav = $("#welcome-nav");
		$videos_nav = $("#videos-nav");
		$music_nav = $("#music-nav");
		$modal = $("#modal");

		$music_portrait_island = $("#music-portrait-island");
		$top_islands = $("#top-islands");
	}

	function setup()
	{
		extend_jquery();
		hide_loading_screen();
		create_interactions();
		music_handling();
		soundcloud_handling();
		resize();
	}

	function resize()
	{
		let is_port = is_portrait();

		$welcome_nav
			.add($videos_nav)
			.switchClass(...switch_if(is_port, "col-xs-4", "col-xs-6"));

		$music_nav
			.switchClass(...switch_if(is_port, "col-xs-4", "col-xs-12"));

		$fixed_content.absoluteCenter();
		$scroll_content.relativeCenterY();

		if ($carousel)
			$carousel.relativeCenterY();
	}

	/********************************************/
	// Extend Jquery	
	/********************************************/

	function extend_jquery()
	{

		$.fn.exists = function()
		{
			return this.length > 0;
		}

		$.fn.isVisible = function()
		{
			return !this.hasClass("hidden");
		}

		$.fn.setVisible = function(value)
		{
			this.each(function(){
				let $this = $(this);
				if (value && !$this.isVisible())
					$this.removeClass("hidden");

				else if (!value && $this.isVisible())
					$this.addClass("hidden");
			});

			return this;
		}

		$.fn.switchClass = function(a, b) 
		{
			return this.hasClass(a) ? this.removeClass(a).addClass(b) : this;
		};

		$.fn.absoluteCenter = function()
		{
			let tagX = (window.innerWidth - this.width()) * 0.5;
			let tagY = (window.innerHeight - this.height()) * 0.5;
			this.css({
				left: tagX > 0 ? tagX : 0,
				top: tagY > 0 ? tagY : 0
			});
		}
		$.fn.absoluteCenterY = function()
		{
			let tagY = (window.innerHeight - this.height()) * 0.5;
			this.css({
				top: tagY > 0 ? tagY : 0
			});
		}

		$.fn.relativeCenterY = function()
		{
			let tagY = (window.innerHeight - this.height()) * 0.5;
			this.css({
				"margin-top": tagY > 0 ? tagY : 0
			});
		}
	}

	/********************************************/
	// Carosel	
	/********************************************/

	function show_carousel($content, first_index)
	{
		ensure_carousel();
		$carousel.setVisible(true);
		$scroll_content.setVisible(false);

		var $inner = $carousel.find(".carousel-inner");
		var $indicators = $carousel.find(".carousel-indicators");

		$inner.children().remove();
		$indicators.children().remove();

		$content.each(function(i, tag) {
			let $tag = $(tag);

			$tag.waitForImages(() => {

				let active = first_index==i ? " active" : "";
				$(`<div class="item center${active}"></div>`)
					.append($(tag))
					.appendTo($inner)

				$(`<li data-target="#carousel-main" class="${active}" data-slide-to="${i}"></li>`)
					.appendTo($indicators);

				$carousel.carousel();
				$carousel.relativeCenterY();

			});
		});

		/*$carousel.waitForImages(()=> {
			$carousel.carousel();
			$carousel.relativeCenterY();
		});*/
	}

	function hide_carousel()
	{
		if ($carousel != null)
			$carousel.setVisible(false);

		$scroll_content.setVisible(true);
		$scroll_content.relativeCenterY();
		music_resume();
		stop_video_playback();
	}

	function ensure_carousel()
	{
		if ($carousel != null)
			return $carousel;

		$carousel = 
		$(`<div id="carousel-main" class="carousel slide" data-ride="carousel" data-interval="false">
				<!-- Indicators -->
				<ol class="carousel-indicators"></ol>

				<div class="carousel-inner"></div>

				<a class="left carousel-control" href="#carousel-main" data-slide="prev">
					<span class="glyphicon glyphicon-chevron-left"></span>
				</a>
				<a class="right carousel-control" href="#carousel-main" data-slide="next">
					<span class="glyphicon glyphicon-chevron-right"></span>
				</a>
			</div>`);

		let $holder = 
			$(`<div class="container-fluid"></div>`);

		$holder.appendTo(document.body);
		$carousel.appendTo($holder);
		$carousel.on("slid.bs.carousel", () => $carousel.relativeCenterY());
	}

	/********************************************/
	// Media	
	/********************************************/

	function music_handling() 
	{
		$music = $("#music");
		$music.setVisible(true);

		audio = $music.find("audio")[0];
		audio.play();

		audio_should_be_paused = false;

		$music.click(function() {

			audio_should_be_paused = !audio.paused;
			if (audio.paused)
				audio.play();
			else
				audio.pause();

			set_audio_icon();
		});

		setTimeout(set_audio_icon, 250);
	}

	function soundcloud_handling()
	{
		let $widget = $("#music_widget");
		if (!$widget.exists())
			return;

		SCWidget = SC.Widget("music_widget");
		SCWidget.bind("play", music_hold);
		SCWidget.bind("pause", music_resume);
		SCWidget.bind("finished", music_resume);
	}

	function music_hold()
	{
		audio.pause();
		$music.setVisible(false);
		set_audio_icon();
	}

	function music_resume()
	{
		$music.setVisible(true);
		if (audio_should_be_paused || !audio.paused)
			return;

		audio.play();
		set_audio_icon();
	}

	function stop_video_playback()
	{
		var $vid = $(".item.active").find("iframe");
		if (!$vid.exists())
			return;

		var src = $vid.attr('src');

		if (src && src.indexOf("vimeo") > -1) {
			$vid.attr('src', '');
			$vid.attr('src', src);
		}
	}

	function stop_soundcloud_playback()
	{
		if (SCWidget == null)
			return;

		SCWidget.pause();
		SCWidget.seekTo(0);
	}

	function set_audio_icon()
	{
		var playing = !audio.paused;
		var css_value = "url('images/audio_icon" + (!playing ? "_disabled" : "") + ".png')";
		$music.css("background", css_value);
	}

	/********************************************/
	// Helper	
	/********************************************/

	function create_interactions()
	{
		$(".nav-btn").click((ev) => {
			let $this = $(ev.currentTarget);
			let paneId = $this.data("target-pane");
			show_pane(paneId);
		});

		//cuz dynamic
		$(document.body).on('click', '.carousel-content', (ev) => {			
			let $this = $(ev.currentTarget);

			if ($this.hasClass("carousel-src-videos"))
				show_video_content($(".carousel-src-videos"), $this.data("vimeo-id"));
			else if ($this.hasClass("carousel-src-bts"))
				show_video_content($(".carousel-src-bts"), $this.data("vimeo-id"));
			else if ($this.hasClass("carousel-src-slideshow"))
				show_slideshow_content();
		});

		$modal.click(() => {
			let to_fixed_content = $carousel == null || !$carousel.isVisible();

			//If there is no fixed content, it's because we're viewing one of the island
			//directly, rather than loaded from a pane. If that's the case, we just go back to the
			//root to serve the page
			if (to_fixed_content && !$fixed_content.children().exists()) {
				let origin = window.location.origin;
				window.location = origin;
			} else if (to_fixed_content)
				hide_all_panes();
			else
				hide_carousel();
		});

	}

	function show_video_content($selection, initialID)
	{
		var $content = $("<div></div>");
		var initialIndex = 0;

		$selection.each(function(i, $tag){
			let $this = $($tag);
			let src = $this.data("vimeo-id");
			
			if (src == initialID)
				initialIndex = i;

			var url = VIMEO_URL + src + VIMEO_OPT;
			let $iframe = $('<iframe src="' + url + '" frameborder="0" width="1280" height="720" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
			$content.append($iframe);
		});

		show_carousel($content.children(), initialIndex);
		music_hold();
	}

	function show_slideshow_content()
	{
		var $content = $("<div></div>");

		BEHIND_THE_SCENES_URLS.forEach(function(url, i) {
			$content.append($(`<img class="img-responsive margin-center" src="${url}"></img>`));
		});

		show_carousel($content.children(), 0);
	}

	function switch_if(condition, a, b)
	{
		return condition ? [a,b] : [b,a];
	}

	function is_portrait()
	{
		return window.innerWidth < window.innerHeight;
	}

	function hide_loading_screen()
	{
		$("#webload")
			.addClass("transition-1s")
			.addClass("preload-complete")
			.one(TRANSITION_EVENT, function() {
				$(this).remove();
			});

		$fixed_content.setVisible(true);
		$scroll_content.setVisible($scroll_content.children().exists());
		$modal.setVisible($scroll_content.children().exists());
	}

	function hide_all_panes()
	{
		$modal.setVisible(false);
		$scroll_content.setVisible(false);
		$(".pane").setVisible(false);

		stop_soundcloud_playback();
		music_resume();
	}

	function show_pane(id)
	{
		if (!loaded_panes.has(id)) {
			load_pane(id);
			return;
		}

		let $pane = $(`#${id}-pane`);
		if (!$pane.exists())
			//if we've gotten here, the user is trying to show a pane that is not yet completed loading
			return;

		hide_all_panes();

		$pane.setVisible(true);
		$modal.setVisible(true);
		$scroll_content.setVisible(true);
		$scroll_content.relativeCenterY();

	}

	function load_pane(id) {
		loaded_panes.add(id);
		let url = '/' + id;
		let $pane = $(`<div id="${id}-pane" class="hidden pane"></div>`);

		$.ajax({
			url: url,
			data: { append: true }
		})
		.done((data) => {
			$pane
				.html(data)
				.appendTo($scroll_content)
				.waitForImages(() => {
					show_pane(id);
				});

			//Specific case for loading the music pane
			if (id == "music" && SCWidget == null)
				soundcloud_handling();
		});
	}

	/********************************************/
	// Execute	
	/********************************************/

	//initialize on document ready
	$(document).ready(get_references);

	//remove loading screen
	$(window).load(setup);

	//call resize
	$(window).resize(resize);
	$(window).on("orientationchange", resize);

}($)