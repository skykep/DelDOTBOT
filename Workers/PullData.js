const db            = require('./DB.js');                      //Sqlite3 DB functions
var XMLHttpRequest  = require("xmlhttprequest").XMLHttpRequest;
var xhrAdvisory     = new XMLHttpRequest();
var xhrScheduled    = new XMLHttpRequest();
var advisoryClosureID;
var scheduleClosureID;
var advisoryResponse;
var scheduleResponse;
var advisoryCount = 0;
var scheduleCount = 0;
var i=0;
var j=0;
var query;

xhrAdvisory.timeout = 3000;
xhrAdvisory.addEventListener("readystatechange", advisoryRequest, false);
xhrScheduled.timeout = 3000;
xhrScheduled.addEventListener("readystatechange", scheduleRequest, false);  

//Get DelDot Advisory JSON
getDelDotAdvisories();
setInterval(getDelDotAdvisories,20000);
function getDelDotAdvisories() {
  try {
  xhrAdvisory.open('GET', "https://tmc.deldot.gov/json/advisory.json", true);
  xhrAdvisory.send();
  }
  catch (e) {
    console.log(new Date() + " : " + e);
    db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
  }
}

//Callback function for HTTP request for DelDot Advisories
function advisoryRequest(e) {
  try {
  if (xhrAdvisory.readyState == 4 && xhrAdvisory.status == 200) {
    advisoryResponse = JSON.parse(xhrAdvisory.responseText);
    advisoryCount = Object.keys(advisoryResponse.advisories).length;
    module.exports.advisoryResponse = advisoryResponse;
    module.exports.advisoryCount = advisoryCount;
    i=0;
    while (i < advisoryCount) {
      advisoryClosureID = advisoryResponse.advisories[i].id;
      if ((advisoryResponse.advisories[i].where.location.includes("LANE") === false) && (advisoryResponse.advisories[i].where.location.includes("CLOS") === true) && (advisoryResponse.advisories[i].where.location.includes("SHOULDER") === false) && (advisoryResponse.advisories[i].where.location.includes("LN CLOS") === false)) {
      y = i;
      insertAdvisorytoDB(y);       //Call the insert function to take the filtered result and insert in DB
      }
    i++;
    }
  }
  }
  catch (e) {
  console.log(e);
  db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
  }
 }

//Insert the advisory closure into the database
function insertAdvisorytoDB(y) {
  try {
  db.db.each("SELECT COUNT(*) as rowcount from closures WHERE eventID=" + `'${advisoryClosureID}'`, function(err,row) {
  if (err) {
    throw err;
  }
  if (row.rowcount == "0") {
    query="INSERT INTO closures (eventID, desc, timestamp, status, link, posted, lat, long, address, type, wherename) VALUES (" + `"${advisoryResponse.advisories[y].id}"` + "," + `"${advisoryResponse.advisories[y].where.location}"` + "," + `"${advisoryResponse.advisories[y].timestamp}"` + "," + `"Advisory"` + "," + `"${advisoryResponse.advisories[y].published.linkbackUrl}"` + "," + `"FALSE"` + "," + `"${advisoryResponse.advisories[y].where.lat}"` + "," + `"${advisoryResponse.advisories[y].where.lon}"` + "," + `"${advisoryResponse.advisories[y].where.address.address1}"` + "," + `"${advisoryResponse.advisories[y].type.name}"` + "," + `"${advisoryResponse.advisories[y].where.county.name}"` + ");";
    console.log(advisoryResponse.advisories[y].id + " Inserted!");
    db.db.run(query);
  }
  else {
    //console.log("no new records to add!");
  }
  
  });
  getDelDotScheduled();
  }
  catch (e) {
  console.log(e);
  db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
  }
}
//Get DelDot Scheduled JSON
function getDelDotScheduled() {
  try {
  xhrScheduled.open('GET', "https://deldot.gov/json/str.json", true);
  xhrScheduled.send();
  }
  catch (e) {
    console.log(e);
    db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
  }
}

//Callback function for HTTP request for DelDot Scheduled Closures
function scheduleRequest(e) {
  try {
  if (xhrScheduled.readyState == 4 && xhrScheduled.status == 200) {
    scheduleResponse = JSON.parse(xhrScheduled.responseText);
    scheduleCount = Object.keys(scheduleResponse).length;
    module.exports.scheduleResponse = scheduleResponse;
    module.exports.scheduleCount = scheduleCount;
    j=0;
    while (j < scheduleCount) {
      scheduleClosureID = scheduleResponse[j].str.strId;
      if (scheduleResponse[j].str.impactType == "Closure") {
      z = j;
      insertScheduletoDB(z);       //Call the insert function to take the filtered result and insert in DB
      }
    j++;
    }
  }
  }
  catch (e) {
  console.log(e);
  db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
  }
}

//Insert the scheduled closure into the database
function insertScheduletoDB(z) {   
  try {
  db.db.each("SELECT COUNT(*) as rowcount from closures WHERE eventID=" + `'${scheduleClosureID}'`, function(err,row) {
    if (err) {
      throw err;
    }
    if (row.rowcount == "0") {
      query="INSERT INTO closures (eventID, title, desc, status, starttime, posted, county, lat, long) VALUES (" + `"${scheduleResponse[z].str.strId}"` + "," + `"${scheduleResponse[z].str.title}"` + "," + `"${scheduleResponse[z].str.construction}"` + "," + `"Scheduled"` +  "," + `"${scheduleResponse[z].str.startDate}"` + "," + `"FALSE"` + "," + `"${scheduleResponse[z].str.county}"` + "," + `"${scheduleResponse[z].str.latitude}"` + "," + `"${scheduleResponse[z].str.longitude}"` + ");";
      console.log(scheduleResponse[z].str.strId + " Inserted!");
      db.db.run(query);
    }
    else {
      //console.log("no new records to add!");
    }
    });
  }
  catch (e) {
  console.log(e);
  db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
  }
}

module.exports = { getDelDotAdvisories, getDelDotScheduled, advisoryResponse, scheduleResponse, advisoryCount, scheduleCount };