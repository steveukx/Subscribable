module.exports = function(grunt) {

   grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),

      git: {
         options: {
            message: "Build release <%= pkg.version %>"
         },
         commit: {
            files: [
               { src: [ 'dist/<%= pkg.version %>/*' ] }
            ]
         }
      },

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

   grunt.loadNpmTasks('grunt-release-steps');

   grunt.loadNpmTasks('grunt-git');

   grunt.loadNpmTasks('grunt-contrib-uglify');

   grunt.loadNpmTasks('grunt-contrib-copy');

   grunt.registerTask('bump',    ['release:bump:minor']);
   grunt.registerTask('install', ['copy', 'uglify']);
   grunt.registerTask('publish', ['git', 'release:add:commit:push:tag:pushTags']);
};
