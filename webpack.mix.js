const mix = require('laravel-mix');


mix.options({
    processCssUrls: false
}).sass('source/scss/style.scss', 'assets/css/style.min.css');
 
mix.combine([
    'source/js/classes/*',
    'source/js/components/*',
    'source/js/misc/*',
    'source/js/vendors/*'
], 'assets/js/app.js');