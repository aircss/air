/*  Copyright (c) 2023, Morgan Delahaye. */
'use strict';


// extensions must be declared from the least to most specific
const extensions = [
    {suffix: '-m', width: '32rem'},
    {suffix: '-l', width: '64rem'},
]

const regex = /^\/\* generate: container-rule \*\/[\s\S]*\/\* end generate \*\/$/gm


module.exports = function (grunt) {
    grunt.registerMultiTask('breakpoints', 'Generate optional breakpoint extensions.', function () {
        this.files.forEach(filePair => {
            filePair.src.forEach(file => {

                let source = grunt.file.read(file)
                let matches = source.match(regex);

                if (!matches) return;  // preemptive exit
                grunt.log.writeln('Append optional hover extensions to ' + String(file).cyan);

                for (const match of matches) {
                    for (const extension of extensions) {
                        // TODO: container queries will be enabled when the specificity
                        // score will be correctly calculated. Until this happen, fall
                        // back to standard media queries.
                        let header = `@media (min-width: ${extension.width}) {`
                        // let header = `@container (min-width: ${extension.width}) {`;

                        let footer = '}'

                        let content = match.split('\n')
                                           .slice(1, -1)
                                           .map(line => line.trim().replace(/^(\.[^\s]*)(.+)$/, `$1${extension.suffix}$2`))
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
