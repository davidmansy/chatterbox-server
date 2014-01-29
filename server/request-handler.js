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

var contentT = {
  "/client/scripts/app.js": "text/javascript",
  "/client/scripts/config.js": "text/javascript",
  "/client/bower_components/handlebars/handlerbars.min.js": "text/javascript",
  "/client/bower_components/underscore/underscore.min.js": "text/javascript",
  "/client/bower_components/jquery/jquery.min.js": "text/javascript",
  "/client/style/style.css": "text/css"
};

var sendUrlResponse = function(url){
  response.writeHead(200, {
    'Content-Type': contentT[url];
  });
  var file = fs.createReadStream(__dirname + url);
  file.pipe(response);
}


var msg = [];
var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */
   var sendResponse = function(statusCode, content) {
      var headers = defaultCorsHeaders;
      headers['Content-Type'] = "text/plain";
      response.writeHead(statusCode, headers);
      response.end(content);
   };

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
   if (request.url === '/1/classes/chatterbox'){
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
      // console.log('msgJson');
      // console.log(msgJson);
      sendResponse(200, msgJson);
    } else {
      sendResponse(200, "Hello world!");
    }
   } else if (request.url === '/'){
      if (request.method === 'GET') {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        var file = fs.createReadStream(__dirname + "/client/index.html");
        file.pipe(response);
      }
   } else if (request.url === '/scripts/app.js') {

      sendUrlResponse(request.url)
      if (request.method === 'GET') {
        response.writeHead(200, {
          'Content-Type': 'text/javascript'
        });
        var file = fs.createReadStream(__dirname + "/client/scripts/app.js");
        file.pipe(response);
      }    
   } else {
     sendResponse(200, "Hello world!");
   }

  console.log("Serving request type " + request.method + " for url " + request.url);



};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports= handleRequest;
