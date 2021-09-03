//Required Modules
const fetch = require('node-fetch');
const sql = require('../Workers/DB.js');
const config = require('../config.json');
const returndata = require('../Workers/ReturnData.js');
const Embeds = require('../Workers/Embeds.js');

//DE specific variables & constants
const advisoryURL = 'https://tmc.deldot.gov/json/advisory.json';
const scheduleURL = 'https://deldot.gov/json/str.json';
var advisoryCount;
var scheduleCount;

module.exports = {
	Pull: function Pull(bot) {
		//bot.DEChannel = bot.channels.cache.find(channel => channel.id === config.DE.TestChannel);
		bot.DEChannel = bot.channels.cache.find(channel => channel.id === config.DE.ClosureChannel);
		//Fetch the DelDot Advisory Feed
		fetch(advisoryURL)
		.then(response => response.json())
		.then(advisoryResponse => {
			advisoryCount = advisoryResponse.advisories.length;
			i=0;
			while (i < advisoryCount) {
				let entry = advisoryResponse.advisories[i];
				entry.EventType = "Advisory";
				entry.Status = "New";
				if (((entry.where.location.includes("LANE") === false) && (entry.where.location.includes("CLOS") === true) && (entry.where.location.includes("SHOULDER") === false) && (entry.where.location.includes("LN CLOS") === false)) || (entry.where.location.includes("RAMP CLOS") === true) || (entry.where.location.includes("ALL LANES CLOSED") === true)) {
					sql.db.get(`SELECT * FROM closures WHERE EventID="${entry.id}"`, function (err,row) {
					if (err) {
						throw err;
						console.log(err);
					}
					if (!row) {
						bot.DEChannel.send(Embeds.DEAdvisoryClose(entry)).then(msg => { sql.db.run(`UPDATE closures SET MessageID="${msg.id}" WHERE EventID="${entry.id}"`); } );
						sql.db.run("INSERT INTO closures (EventID, Desc, TimeStamp, EventType, AdvisoryType, Link, MessageID, Lat, Lon, Address, County) VALUES (?,?,?,?,?,?,?,?,?,?,?)", returndata.AdvisoryDE(entry));  
						console.log(new Date().toLocaleString() + " " + entry.id + " Inserted!");
						
					}
					});
				}
				i++;
			}
			//Update closures that were either updated or removed from the DelDot Feed
			sql.db.each("SELECT * FROM closures WHERE EventType='Advisory'", function (err,row) {
			if (err) {
				throw err;
				console.log(err);
			}
			i=0;
			let advisoryValid = false;
			while (i < advisoryCount) {
				entry = advisoryResponse.advisories[i];
				entry.EventType = "Advisory";
				if (row.EventID == entry.id) {
					if ((entry.where.location.includes("LANE CLOS") === false) && (entry.where.location.includes("LN CLOS") === false) && (entry.where.location.includes("RIGHT LANE") === false) && (entry.where.location.includes("LEFT LANE") === false)) {
						advisoryValid = true; //If closure is valid, do not remove from DB
						//If timestamp and description change, send the update
						if ((row.TimeStamp != entry.timestamp) && (row.Desc != entry.where.location)) {
							entry.Status = "Updated";
							bot.DEChannel.send(Embeds.DEAdvisoryClose(entry));
							console.log(row);
							console.log(entry);
							sql.db.run(`UPDATE closures SET TimeStamp="${entry.timestamp}",Desc="${entry.where.location}" WHERE EventID="${row.EventID}"`);
							console.log(new Date().toLocaleString() + " " + row.EventID + " Updated!");
						}
					}
				}
				i++;
			}
			if (!advisoryValid) {
				bot.DEChannel.send(Embeds.DEAdvisoryOpen(row));
				sql.db.run(`DELETE FROM closures WHERE EventID="${row.EventID}"`);
				console.log(new Date().toLocaleString() + " " + row.EventID + " Deleted!");
			}
			});
		})
		
		//Fetch the DelDot Schedule Feed
		fetch(scheduleURL)
		.then(response => response.json())
		.then(scheduleResponse => {
			scheduleCount = scheduleResponse.length;
			i=0;
			while (i < scheduleCount) {
				let entry = scheduleResponse[i].str;
				entry.EventType = "Scheduled";
				if (((entry.impactType == "Closure") || ((entry.impactType == 'Restriction') && ((entry.construction.toUpperCase().includes("AMP CLOS")) == true) || (entry.construction.toUpperCase().includes("ROAD CLOS")) || (entry.construction.toUpperCase().includes("CLOSURE OF ROADWAY")))) && (entry.releaseId != "-1")) {
					sql.db.get(`SELECT * FROM closures WHERE EventID="${entry.strId}"`, function (err,row) {
					if (err) {
						throw err;
						console.log(err);
					}
					if (!row) {
						bot.DEChannel.send(Embeds.DEScheduleClose(entry)).then(msg => { sql.db.run(`UPDATE closures SET MessageID="${msg.id}" WHERE EventID="${entry.strId}"`); } );
						sql.db.run("INSERT INTO closures (EventID, Desc, TimeStamp, EventType, Link, MessageID, Lat, Lon, Address, County) VALUES (?,?,?,?,?,?,?,?,?,?)", returndata.ScheduleDE(entry));  
						console.log(new Date().toLocaleString() + " " + entry.strId + " Inserted!");
					}
					});
				}
				i++;
			}
			//Remove closures that are no longer in the DelDot Schedule Feed
			sql.db.each("SELECT * FROM closures WHERE EventType='Scheduled'", function (err,row) {
			if (err) {
				throw err;
				console.log(err);
			}
			i=0;
			let scheduleValid = false;
			while (i < scheduleCount) {
				entry = scheduleResponse[i].str;
				entry.EventType = "Scheduled";
				if (row.EventID == entry.strId) {
					scheduleValid = true; //If closure is valid, do not remove from DB
				}
				i++;
			}
			if (!scheduleValid) {
				//bot.DEChannel.send(Embeds.DEScheduleOpen(row));
				sql.db.run(`DELETE FROM closures WHERE EventID="${row.EventID}"`);
				console.log(new Date().toLocaleString() + " " + row.EventID + " Deleted!");
			}
			});
		})
		.catch(err => {
		  console.log(new Date().toLocaleString() + err);
		});
	}
};