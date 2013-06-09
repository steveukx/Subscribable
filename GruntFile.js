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

      requirejs: {
         compile: {
            options: {
                 out: "./dist/<%= pkg.version %>/<%= pkg.name %>.js"
               , name: "subscribable"
               , baseUrl: "src/"
               , optimize: "none"
            }
         }
      }
   });

   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-requirejs');

   // Default task(s).
   grunt.registerTask('default', ['requirejs', 'uglify']);

};
