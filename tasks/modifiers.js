'use strict';


const breakpoints = [
    {suffix: '-m', width: '32rem'},
    {suffix: '-l', width: '64rem'},
]

const regex = /^\/\* generate: container-rule \*\/[\s\S]*\/\* end generate \*\/$/gm


module.exports = function (grunt) {
    grunt.registerMultiTask('modifiers', 'Generate optional extensions.', function () {
        this.files.forEach(filePair => {
            filePair.src.forEach(file => {
                grunt.log.writeln('Append optional extensions to ' + String(file).cyan);

                let source = grunt.file.read(file)
                let matches = [...source.match(regex)]

                for (const match of matches) {
                    for (const breakpoint of breakpoints) {
                        let header = `@container (min-width: ${breakpoint.width}) {`;
                        let footer = '}'

                        let content = match.split('\n')
                                           .slice(1, -1)
                                           .map(line => line.trim().replace(/^(\.[^\s]*)(.+)$/, `$1${breakpoint.suffix}$2`))
                                           .map(line => '  ' + line)

                        let rv = [header, ...content, footer].join('\n')
                        source += `\n\n${rv}`
                    }
                }

                grunt.file.write(file, source);
            });
        });
    });
};
