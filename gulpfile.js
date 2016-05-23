var gulp = require('gulp'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	cssnano = require('gulp-cssnano'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	bower = require('gulp-bower'),
	bowerFiles = require('main-bower-files'),
	angularTemplates = require('gulp-angular-templatecache'),
	htmlmin = require('gulp-htmlmin'),
	imagemin = require('gulp-imagemin');

gulp.task('bower', function () {
    return bower();
});


gulp.task('vendorStyles', function() {
	return gulp.src(bowerFiles('**/*.css'))
		.pipe(gulp.dest('dist/assets/vendor/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssnano())
		.pipe(gulp.dest('dist/assets/vendor/css'));
});

gulp.task('vendorScripts', function() {
	return gulp.src(bowerFiles('**/*.js'))
		.pipe(gulp.dest('dist/assets/vendor/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/vendor/js'));
});

gulp.task('vendorFonts', function() {
	return gulp.src(bowerFiles('**/fonts/*.*'))
		.pipe(gulp.dest('dist/assets/vendor/fonts'));
});

gulp.task('styles', function() {
	return gulp.src('content/styles/main.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(cssnano({ zindex: false }))
		.pipe(gulp.dest('dist/assets/css'));
});

gulp.task('scripts', function() {
	return gulp.src('app/**/*.js')
		.pipe(concat('app.js'))
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'));
});

var config = {
    htmltemplates: 'app/views/**/*.html',
    templateCache: {
        file: 'templates.js',
        options: {
            module: 'mcrutt',
            root: 'app/',
            standAlone: false
        }
    },
    dest: 'dist/assets/html'
};

gulp.task('templates', function() {
	return gulp.src(config.htmltemplates)
        .pipe(htmlmin({collapseWhitespace: false}))
        .pipe(angularTemplates(config.templateCache.file, config.templateCache.options))
        .pipe(gulp.dest(config.dest));
});

gulp.task('images', function() {
	return gulp.src('content/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/assets/images'));
});

gulp.task('default', ['bower', 'vendorStyles', 'vendorScripts', 'vendorFonts', 'styles', 'scripts', 'templates', 'images']);