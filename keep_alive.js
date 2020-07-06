const db    = require('./Workers/DB.js');                      //Sqlite3 DB functions
var express = require("express");
var app     = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
//app.use(express.static("Public"));

// http://expressjs.com/en/starter/basic-routing.html

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
	console.log("Your app is listening on port " + listener.address().port);
});

const http = require("http");
app.get("/", (request, response) => {
	console.log(Date.now() + " Ping Received");
  //response.sendFile(__dirname + "/Public/index.html");
  db.db.all("SELECT eventID, desc, timestamp FROM closures", function(err,row) {
      response.send(JSON.stringify(row[0]));
  });
	//response.sendStatus(200);
});

//Drop a status in the console every 15 minutes
setInterval(consolestatus, 900000);
function consolestatus() {
  console.log(timenow() + " - Pong");
  }

//Get current local time
function timenow() {
  var nd = new Date();
  nd.setHours(nd.getHours() - 4);
  nd = nd.toLocaleString();
  return nd;
}

app.listen(process.env.PORT);