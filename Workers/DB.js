const sqlite3 = require('sqlite3');
const db = new sqlite3.Database("./closureDB");

db.run("CREATE TABLE IF NOT EXISTS closures (EventID TEXT, Desc TEXT, TimeStamp TEXT, EventType TEXT, AdvisoryType TEXT, Link TEXT, MessageID TEXT, Lat TEXT, Lon TEXT, Address TEXT, County TEXT)")
db.run("CREATE TABLE IF NOT EXISTS errlog (timestamp TEXT, err TEXT)");

module.exports = { db };