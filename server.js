var PORT_NUMBER = 3000;
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

var server = http.createServer(function(request, response) {
	var filePath = false;
	if (request.url == '/') {
		filePath = 'public/index.html';
	} else {
		filePath = 'public' + request.url;
	}
	var absPath = './' + filePath;
	serveStatic(response, cache, absPath);
});


function send404(response) {
	response.writeHead(
		404, 
		{'Content-Type': 'text/plain'}
	);
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200, 
		{'Content-Type': mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents)
}

function serveStatic(response, cache, abspath) {
	if(cache[abspath]) {
		sendFile(response, abspath, cache[abspath]);
	} else {
		fs.exists(abspath, function(exists){
			if(exists){
				fs.readFile(abspath, function(err, data){
					if(err) {
						send404(response)
					} else {
						cache[abspath] = data;
						sendFile(response, abspath, data)
					}
				});
			} else {
				send404(response)
			}
		})
	}
}

server.listen(PORT_NUMBER, function(){
	console.log("Server listening on port " + PORT_NUMBER);
})