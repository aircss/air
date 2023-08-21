var http = require('http');
var fs = require('fs');
var path = require('path');



http.createServer(function (request, response) {

    let filePath = path.join(__dirname, 'src', request.url);

    // hijack normalize.css queries to get the npm installed version
    if (filePath.endsWith('/src/normalize.css'))
        filePath = require.resolve('normalize.css');

    // append index.html for directory URLs
    if (filePath.endsWith('/'))
        filePath += 'index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                console.log(`404 - ${request.url}`);
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                console.log(`500 - ${request.url}`);
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end();
            }
        }
        else {
            console.log(`200 - ${request.url}`);
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(8125);
console.log('Development server running at http://127.0.0.1:8125/');
