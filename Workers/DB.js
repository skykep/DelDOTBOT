const sqlite3 = require('sqlite3').verbose();
const db      = new sqlite3.Database("closureDB");

db.run("CREATE TABLE IF NOT EXISTS closures (eventID TEXT, title TEXT, desc TEXT, timestamp TEXT, starttime TEXT, endtime TEXT, status TEXT, link TEXT, posted TEXT, lat TEXT, long TEXT, address TEXT, type TEXT, wherename TEXT);");
db.run("CREATE TABLE IF NOT EXISTS errlog (timestamp TEXT, err TEXT);");

module.exports = { db };