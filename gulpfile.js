/*-----------------------------------------------------------------------------------------------
	Dependencies
 -----------------------------------------------------------------------------------------------*/
var gulp			= require('gulp');
var fs			  	= require('fs');
var $			   	= {};
	$.sass		  	= require('gulp-sass');
	$.postcss	   	= require('gulp-postcss');
	$.sourcemaps	= require('gulp-sourcemaps');
	$.csswring	  	= require('csswring');
	$.autoprefixer  = require('autoprefixer-core');
	$.browserSync   = require('browser-sync');
	$.imagemin	  	= require('gulp-imagemin');
	$.htmlmin	  	= require('gulp-htmlmin');
	$.uglify		= require('gulp-uglify');
	$.size		  	= require('gulp-size');
	$.newer		 	= require('gulp-newer');
	$.babel		 	= require('gulp-babel');
	$.nodemon	   	= require('nodemon');

/*-----------------------------------------------------------------------------------------------
	Paths
 -----------------------------------------------------------------------------------------------*/
var source		  = './src';
var distro		  = './public';

/*-----------------------------------------------------------------------------------------------
	Tasks
 -----------------------------------------------------------------------------------------------*/

function server_task()
{
	//Start Browser Sync
	 $.browserSync.init(null, { proxy: 'localhost:5000' });

	watch_views_and_scripts();
	return watch_css_and_images();
}

function build_task()
{
	html_optimization();
	style_optimization();
	image_optimization();
	script_optimization();
	copy_newer("fonts");
}

function nodemon_task(callback) {
	var nodemon_options = {
		script: 'server.js',
		env: { 'NODE_ENV': 'development' }
	}

	var called = false;
	var callback_switch = function() {
		if (called)
			return;

		called = true;
		callback();
	}

	return $.nodemon(nodemon_options).on('start', callback_switch);
}
 /*-----------------------------------------------------------------------------------------------
	Helper
 -----------------------------------------------------------------------------------------------*/

function build_css_and_images()
{
	process.stdout.write('rebuilding css and images');

	return gulp.src(source + '/styles/**/*.scss')
		.pipe($.sass())
		.pipe($.sourcemaps.init())
		.pipe($.postcss([
			$.autoprefixer({ browsers: ['> 1%', 'IE 9'] })
		]))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(source + '/styles'))
		.pipe($.browserSync.reload({ stream : true }));
}

function watch_views_and_scripts()
{
	var views_and_scripts = [
		'views/*.jade', 
		source + '/scripts/*.js'
	];

	//Watch Stuff that needs a full page reload
	gulp.watch (views_and_scripts,
		function(){
			process.stdout.write('rebuilding html and js');
			$.browserSync.reload(); 
		});
}

function watch_css_and_images()
{
	var scss_and_images = [
		source + '/styles/*.scss',
		source + '/images/**/*'
	]

	gulp.watch(scss_and_images, build_css_and_images)
}

function html_optimization() 
{
	gulp.src(source + '/*.html')
		.pipe($.newer(distro + '/'))
		.pipe($.htmlmin({
			removeComments:true, 
			collapseWhitespace: true,
			minifyJS: true
		}))
		.pipe(gulp.dest(distro + '/'))
		.pipe($.size());
}

function style_optimization()
{
	var distro_styles = distro + "/styles/";
	gulp.src(source + '/styles/**/*.scss')
		.pipe($.newer(distro_styles))
		.pipe($.sass())
		.pipe($.postcss([
			$.autoprefixer({ browsers: ['> 1%', 'IE 9'] }),
			$.csswring
		]))
		.pipe(gulp.dest(distro_styles))
		.pipe($.size());
}

function image_optimization()
{
	var distro_images = distro + "/images/";
	gulp.src(source + '/images/**/*')
		.pipe($.newer(distro_images))
		.pipe($.imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(distro_images))
		.pipe($.size());
}

function script_optimization()
{
	var distro_scripts = distro + "/scripts/";
	gulp.src(source + '/scripts/**/*.js')
		.pipe($.newer(distro_scripts))
		.pipe($.babel({
			presets: ["es2015"],
			only : /bungus*/
		}))
	   	.pipe($.uglify())
		.pipe(gulp.dest(distro_scripts))
		.pipe($.size());
}

function copy_newer(dir)
{
	var distro_fonts = distro + "/" + dir + "/";
	gulp.src(source + '/' + dir + '/**/*')
		.pipe($.newer(distro_fonts))
		.pipe(gulp.dest(distro_fonts))
		.pipe($.size());

}

/*-----------------------------------------------------------------------------------------------
	Setup
 -----------------------------------------------------------------------------------------------*/

gulp.task('nodemon', nodemon_task)
gulp.task('build', build_task);
gulp.task('server', ['nodemon'], server_task);
gulp.task('default', ['server']);