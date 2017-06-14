var http = require('http');
var dispatcher = require('httpdispatcher');
var url = require("url");
var path = require("path");
var fs = require("fs");

var directory = 'C:\\Users\\markus\\Documents\\Visual Studio 2013\\Projects\\TypeScript\\TypeScript';
console.log('creating server on port 5000.');

//Lets define a port we want to listen to
const PORT=5000; 

//We need a function which handles requests and send response
function handleRequest(request, response){
    
  var uri = url.parse(request.url).pathname, filename = path.join(directory, uri);
    
  console.log("Requested Uri " + request.url);
  
  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(file, "binary");
      response.end();
    });
  });
	
	
	
}

//Create a server
var server = http.createServer(handleRequest);

console.log("Files in " + directory);
fs.realpath(directory, function(err, path) {
    if (err) {
        console.log(err);
     return;
    }
    console.log('Path is : ' + path);
});
fs.readdir(__dirname, function(err, files) {
    if (err) return;
    files.forEach(function(f) {
        console.log('Files: ' + f);
    });
});

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});