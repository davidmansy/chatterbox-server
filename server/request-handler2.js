/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
// var queryString = require( "querystring" );

//need to check the url and install it
var url = require( "url" );
var fs = require("fs");

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var contentT = {
  "/scripts/app.js": "text/javascript",
  "/scripts/config.js": "text/javascript",
  "/bower_components/handlebars/handlebars.min.js": "text/javascript",
  "/bower_components/underscore/underscore-min.js": "text/javascript",
  "/bower_components/underscore/underscore-min.map": "text/javascript",
  "/bower_components/jquery/jquery.min.js": "text/javascript",
  "/bower_components/jquery/jquery.min.map": "text/javascript",
  "/styles/styles.css": "text/css"
};

var sendUrlResponse = function(url, response){
  response.writeHead(200, {
    'Content-Type': contentT[url]
  });
  var file = fs.createReadStream(__dirname + "/client" + url);
  file.pipe(response);
}

var sendResponse = function(statusCode, content) {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  response.writeHead(statusCode, headers);
  response.end(content);
};

var buildHeader = function(statusCode) {

};

var msg = [];
var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */
   var coreUrl = url.parse(request.url);
   var path = coreUrl.pathname;

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  if (path === '/1/classes/chatterbox'){
    if(request.method === 'POST'){

      var body = '';
      request.on('data', function (data) {
        body += data;
      });

      request.on('end', function () {
        var POST = JSON.parse(body);
        msg.push(POST);
      });
      sendResponse(200, "Hello world!");
    } 
    else if (request.method === 'GET') {
      var msgJson = JSON.stringify(msg);
      sendResponse(200, msgJson);
    } else {
      sendResponse(200, "Hello world!");
    }

  } else if (path === '/'){
      if (request.method === 'GET') {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        var file = fs.createReadStream(__dirname + "/client/index.html");
        file.pipe(response);
      }

  } else if (contentT[path]) {
      sendUrlResponse(path, response);
  } else {
    sendResponse(404, "Resource not found");
  }
  
  console.log("Serving request type " + request.method + " for url " + path);

};


module.exports = handleRequest;
