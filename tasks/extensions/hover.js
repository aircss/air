/*  Copyright (c) 2023, Morgan Delahaye. */
'use strict';


const extensions = [
    {suffix: '-hvr:hover'},
]

const regex = /^\/\* generate: hover-rule \*\/[\s\S]*\/\* end generate \*\/$/gm


module.exports = function (grunt) {
    grunt.registerMultiTask('hover', 'Generate optional hover extensions.', function () {
        this.files.forEach(filePair => {
            filePair.src.forEach(file => {

                let source = grunt.file.read(file);
                let matches = source.match(regex);

                if (!matches) return;  // preemptive exit
                grunt.log.writeln('Append optional hover extensions to ' + String(file).cyan);

                for (const match of matches) {
                    for (const extension of extensions) {

                        let content = match.split('\n')
                                           .slice(1, -1)
                                           .map(line => line.trim().replace(/^(\.[^\s]*)(.+)$/, `$1${extension.suffix}$2`))

                        source += `\n\n${content.join('\n')}`
                    }
                }

                grunt.file.write(file, source);
            });
        });
    });
};
