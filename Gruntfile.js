'use strict';

module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

  grunt.initConfig({

    build: {
      src: 'src',
      out: 'out',
      dist: 'dist'
    },

    watch: {
      src: {
        files: [
          '<%= build.src %>/**/*.{html,htm,js,css}',
          'test/**/*.{html,htm,js,css}'
        ],
        options: { livereload: true }
      }//,
      //assemble: {
      //  files: [
      //    '<%= assemble.pages.src %>',
      //    '<%= assemble.options.layoutdir %>/*.hbs',
      //    '<%= assemble.options.data %>',
      //    '<%= assemble.options.partials %>'
      //  ],
      //  tasks: ['assemble'],
      //  options: { livereload: true }
      //}
    },

    connect: {
      devserver: {
        options: {
          port: 9000,
          hostname: 'localhost',
          base: ['<%= build.src %>','<%= build.out %>','test'],
          livereload: true,
          open: true
        }
      }
    },

    clean: {
      options: { force: false },
      out: ['<%= build.out %>/*']
    },

    copy: {
      src: {
        expand: true,
        cwd: '<%= build.src %>/',
        src: [
          '**',
          '!**/*.hbs',
          '!_*/**',
          '.htaccess'
        ],
        dest: '<%= build.out %>/'
      },
      fonts: {
        expand: true,
        cwd: '<%= build.src %>/_bower_components/bootstrap/fonts/',
        src: [
          '**',
        ],
        dest: '<%= build.out %>/fonts/'
      }
    },

    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: 'README.md',
            dest: 'src/components/home/',
            ext: '.html'
          }
        ],
        options: {
          template: 'template.html'
        }
      }
    },

    useminPrepare: {
      options: {
        dest: '<%= build.out %>'
      },
      html: '<%= build.out %>/index.html'
    },

    usemin: {
      options: {
        dirs: ['<%= build.out %>']
      },
      html: ['<%= build.out %>/**/*.html'],
      css: ['<%= build.out %>/styles/**/*.css']
    },

    htmlmin: {
      dist: {
        options: {
          removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          //removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          //removeEmptyAttributes: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= build.out %>',
          src: '**/*.html',
          dest: '<%= build.out %>'
        }]
      }
    },

    //imagemin: {
    //  dist: {
    //    files: [{
    //      expand: true,
    //      cwd: '<%= build.src %>/images',
    //      src: '**/*.{png,jpg,jpeg,gif,webp}',
    //      dest: '<%= build.out %>/images'
    //    }]
    //  }
    //},
    //svgmin: {
    //  dist: {
    //    files: [{
    //      expand: true,
    //      cwd: '<%%= build.src %>/images',
    //      src: '{,*/}*.svg',
    //      dest: '<%%= build.out %>/images'
    //    }]
    //  }
    //},

    jshint: {
      options: {jshintrc: '.jshintrc'},
      files: [
        'Gruntfile.js',
        'src/scripts/*.js'
      ]
    },

    rev: {
      files: {
        src: [
          '<%= build.out %>/scripts/{,*/}*.js',
          '<%= build.out %>/styles/{,*/}*.css'
        ]
      }
    },

    //less: {
    //  styles: {
    //    files: {
    //      '<%= build.out %>/styles/**/*.*': ['<%= build.src %>/styles/**/*.less']
    //    }
    //  }
    //},

    //'bower-install': {
    //  target: {
    //    html: 'out/index.html' // point to your HTML file.
    //  }
    //},

    'gh-pages': {
      options: {
        base: 'out',
        branch: 'gh-pages'
      },
      src: ['**/*']
    },

    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= connect.devserver.options.hostname %>:<%= connect.devserver.options.port %>/test.html'],
          globals: ['$']
        }
      }
    }
    //rsync: {
   //   options: {
    //    args: ["--verbose","--delete"],
    //    recursive: true
    //  },
    //  dist: {
    //      options: {
    //        src: "<%= build.out %>/",
    //        dest: "<%= build.dist %>"
    //      }
    //  }
    //}
  });

  //grunt.loadNpmTasks('assemble');
  //grunt.loadNpmTasks('grunt-shell');
  //grunt.loadNpmTasks('grunt-rsync');
  //grunt.loadNpmTasks('assemble-less');

  grunt.registerTask('install', ['shell:npm','shell:bower']);

  grunt.registerTask('build', [
    'clean',
    'markdown',
    //'assemble',
    'copy',
    //'imagemin',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('test', [
      'clean',
      //'assemble',
      'connect:devserver',
      'mocha'
  ]);

  grunt.registerTask('server', ['connect:devserver','watch']);
  grunt.registerTask('run', ['clean','markdown','server']);
  grunt.registerTask('run:build', ['build','server']);

  //grunt.registerTask('deploy:rsync', ['build','rsync']);
  grunt.registerTask('deploy:gh-pages', ['build','gh-pages']);

  grunt.registerTask('deploy', ['deploy:gh-pages']);
  grunt.registerTask('default', ['run']);

};
