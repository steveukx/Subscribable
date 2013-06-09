module.exports = function(grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      uglify: {
         options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
         },
         build: {
            src: 'dist/<%= pkg.version %>/<%= pkg.name %>.js',
            dest: 'dist/<%= pkg.version %>/<%= pkg.name %>-min.js'
         }
      },

      copy: {
         main: {
            files: [
               {expand: false, src: ['src/subscribable.js'], dest: 'dist/<%= pkg.version %>/<%= pkg.name %>.js'}
            ]
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-copy');

   // Default task(s).
   grunt.registerTask('default', ['copy', 'uglify']);

};
