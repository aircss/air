'use strict';

module.exports = function (grunt) {
    grunt.registerMultiTask('skins', 'Build generated HTML files.', function () {
        var options = this.options({type: 'variable'}),
            tally   = 0;

        if (options.type === 'variables' && !!options.variables) {


            const re = /--([^\:]+)[:\s]+([^\;]+)/g
            const zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row && row[c]))


            const variables = grunt.file
                .read(options.variables)
                .split('\n')
                .map(line => Object.fromEntries(zip(['name', 'value'], Array.from(line.matchAll(re))[0]?.slice(1, 3))))
                .filter(obj => obj.name)

            this.files.forEach(function (filePair) {
                filePair.src.forEach(function (file) {

                    let rv = grunt.file.read(file)
                         .split('\n')
                         .map(line => line.match(/<%= name %>|<%= value %>/g) ? variables.map(obj => line.replace(/<%= value %>/g, obj.value).replace(/<%= name %>/g, obj.name)).join('\n') : line)

                         grunt.file.write(file, rv.join('\n'));
                         tally += 1;
                });
            });

        } else {
            throw Error("invalid options");
        }


        grunt.log.writeln('Stamped license on ' + String(tally).cyan + ' files.');
    });
};
