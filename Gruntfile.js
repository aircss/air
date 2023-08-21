module.exports = function (grunt) {

    // -- Config -------------------------------------------------------------------

    grunt.initConfig({

        nick : 'air',
        pkg  : grunt.file.readJSON('package.json'),

        // -- Clean Config ---------------------------------------------------------

        clean: {
            build    : ['build/'],
            release  : ['release/<%= pkg.version %>/']
        },

        // -- Copy Config ----------------------------------------------------------

        copy: {
            build: {
                src    : 'src/**/css/*.css',
                dest   : 'build/',
                expand : true,
                flatten: true
            },

            release: {
                src : '{LICENSE,README.md,HISTORY.md}',
                dest: 'build/'
            }
        },

        // -- Concat Config --------------------------------------------------------

        concat: {
            build: {
                files: [
                    {'build/base.css': [
                        'node_modules/normalize.css/normalize.css',
                        'build/base.css'
                    ]},

                    // Rollups

                    {'build/<%= nick %>.css': [
                        'build/base.css',
                    ]},
                ]
            }
        },

        // -- PostCSS Config --------------------------------------------------------

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')(),
                ],
            },
            dist: {
                src: 'build/*.css'
            }
        },

        // -- CSSLint Config -------------------------------------------------------

        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },

            base   : ['src/base/css/*.css'],
        },

        // -- CSSMin Config --------------------------------------------------------

        csso: {

            dynamic_mappings: {
                options: {
                    report: 'gzip',
                },
                expand: true,
                cwd: 'build/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/',
                ext: '.min.css'
            }
        },

        // -- Compress Config ------------------------------------------------------

        compress: {
            release: {
                options: {
                    archive: 'release/<%= pkg.version %>/<%= nick %>-<%= pkg.version %>.tar.gz'
                },

                expand : true,
                flatten: true,
                src    : 'build/*',
                dest   : '<%= nick %>/<%= pkg.version %>/'
            }
        },

        // -- License Config -------------------------------------------------------

        license: {
            air: {
                options: {
                    banner: [
                        '/*! Air v<%= pkg.version %> | BSD License | https://aircss.io */\n',
                    ].join('\n')
                },

                expand: true,
                src   : ['build/*.css']
            }
        },

        // -- Watch/Observe Config -------------------------------------------------

        observe: {
            src: {
                files: 'src/**/css/*.css',
                tasks: ['test', 'suppress', 'build'],

                options: {
                    interrupt: true
                }
            }
        }
    });

    // -- Main Tasks ---------------------------------------------------------------

    // npm tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('@lodder/grunt-postcss');
    grunt.loadNpmTasks('grunt-csso');

    // Local tasks.
    grunt.loadTasks('tasks/');

    grunt.registerTask('default', ['test', 'build']);
    grunt.registerTask('test', ['csslint']);
    grunt.registerTask('build', [
        'clean:build',
        'copy:build',
        'concat:build',
        'postcss',
        'csso',
        'license'
    ]);

    // Makes the `watch` task run a build first.
    grunt.renameTask('watch', 'observe');
    grunt.registerTask('watch', ['default', 'observe']);

    grunt.registerTask('release', [
        'default',
        'clean:release',
        'copy:release',
        'compress:release'
    ]);

};
