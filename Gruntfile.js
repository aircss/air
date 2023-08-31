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
            assets: {
                src    : 'assets/*',
                dest   : 'build/',
                expand : true,
            },

            build: {
                src    : 'src/**/css/*.css',
                dest   : 'build/',
                expand : true,
                flatten: true
            },

            doc: {
                expand : true,
                src    : '**/*.html',
                cwd    : 'src/',
                dest   : 'build/doc/',
            },

            release: {
                src : '{LICENSE,README.md,HISTORY.md}',
                dest: 'build/'
            }
        },

        // -- Generate CSS ---------------------------------------------------------

        generate: {
            colors: {
                options: {
                    type: 'variables',
                    variables: 'src/variables/colors.css',
                },

                expand: true,
                src   : ['build/*.css']
            }
        },

        skins: {
            template: {
                options: {
                    type: 'variables',
                    variables: 'src/variables/colors.css',
                },

                expand: true,
                src   : ['build/doc/**/*.html']
            }
        },

        // -- Concat Config --------------------------------------------------------

        concat: {
            build: {
                files: [
                    {'build/typography.css': [
                        'build/font-size.css',
                        'build/measure.css',
                        'build/line-height.css',
                        'build/tracking.css',
                        'build/font-weight.css',
                        'build/font-style.css',
                        'build/text-align.css',
                        'build/text-transform.css',
                        'build/text-decoration.css',
                        'build/white-space.css',
                        'build/font-family.css',
                    ]},

                    {'build/layout.css': [
                        'build/display.css',
                        'build/flex.css',
                        'build/order.css',
                        'build/align-content.css',
                        'build/align-items.css',
                        'build/align-self.css',
                        'build/box-sizing.css',
                        'build/spacing.css',
                        'build/floats.css',
                        'build/clearfix.css',
                        'build/widths.css',
                        'build/max-widths.css',
                        'build/heights.css',
                        'build/position.css',
                        'build/coordinates.css',
                        'build/vertical-align.css',
                        'build/z-index.css',
                        'build/scale.css',
                    ]},

                    {'build/theming.css': [
                        'build/animate.css',
                        'build/skins.css',
                        'build/borders.css',
                        'build/border-colors.css',
                        'build/border-radius.css',
                        'build/border-style.css',
                        'build/border-widths.css',
                        'build/filters.css',
                        'build/opacity.css',
                        'build/shadow.css',
                        'build/background-size.css',
                    ]},

                    {'build/elements.css': [
                        'build/tables.css',
                        'build/forms.css',
                        'build/links.css',
                    ]},

                    // Roll-ups
                    {'build/<%= nick %>.css': [
                        'node_modules/normalize.css/normalize.css',
                        'build/elements.css',
                        'build/typography.css',
                        'build/layout.css',
                        'build/theming.css',
                    ]},
                ]
            }
        },

        // -- PostCSS Config --------------------------------------------------------

        postcss: {
            options: {
                processors: [
                    require('autoprefixer')(),
                    require('postcss-css-variables')(),
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

            base   : ['src/*/css/*.css'],
        },

        // -- CSSMin Config --------------------------------------------------------

        csso: {

            dynamic_mappings: {
                options: {
                    report: 'gzip',
                    forceMediaMerge: true,
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
                files: 'src/**/*',
                tasks: ['test', 'build'],

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
        'copy:assets',
        'copy:build',
        'copy:doc',
        'generate',
        'skins',
        'concat:build',
        'postcss',
        'csso',
        'license',
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
