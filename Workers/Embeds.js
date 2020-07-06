const db      = require('./DB.js');           //Sqlite3 DB functions
var pulldata  = require('./PullData.js');     //DelDot JSON feeds

module.exports = {
  //Get active closures from the DB and embed them to Discord
  embedAdvisories: function embedAdvisories(closureChannel) {
    try{
    db.db.each("SELECT eventID, desc, timestamp, status, link, lat, long, address, type, wherename FROM closures WHERE status='Advisory' AND posted='FALSE';", function(err,row) {
      if (err) {
        throw err;
      }
      var wmelink="https://www.waze.com/en-US/editor?env=usa&lon=" + row.long + "&lat=" + row.lat + "&zoom=6&marker=true";
      var lmlink="https://www.waze.com/livemap?lon=" + row.long + "&lat=" + row.lat + "&zoom=17";
      var applink="https://www.waze.com/ul?ll=" + row.lat + "," + row.long;
      if (row.address == "null") {
        var wherename = row.wherename;
      } else { 
        var wherename = row.address; 
      }
      if (row.type == "Construction") {
        var colorcode = "0xFF6B00";
      } else {
        var colorcode = "0xFF0000";
      }
      var friendlydate = new Date(row.timestamp);
      const exampleEmbed = {
        color: colorcode,
        title: row.type + " near " + wherename,
        url: row.link,
        author: {
          name: 'DelDot DataFeed (Advisory Closure)',
          icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
          url: 'https://deldot.gov',
        },
        //description: row.desc,
        thumbnail: {
          url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
        },
        fields: [
          {
            name: 'Reason',
            value: row.desc,
          },
          {
            name: 'Location',
            value: `[WME Link](${wmelink}) | [Livemap Link](${lmlink}) | [App Link](${applink})`,
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false,
          },
        ],
        timestamp: friendlydate.toLocaleString(),
        footer: {
          text: "Event " + row.eventID + " updated at ",
          //icon_url: 'https://i.imgur.com/wSTFkRM.png',
        },
      };
      closureChannel.send({ embed: exampleEmbed });
      db.db.run("UPDATE closures SET posted='TRUE' WHERE eventID=" + `"${row.eventID}"`);
      });
    }
    catch (e) {
    console.log(e);
    db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
  }
  },
  //Get scheduled closures from the DB and embed them to Discord
  embedSchedules: function embedSchedules(closureChannel) {
    try{
    db.db.each("SELECT eventID, title, desc, starttime, county, lat, long FROM closures WHERE status='Scheduled' AND posted='FALSE'", function(err,row) {
      if (err) {
        throw err;
      }
      var wmelink="https://www.waze.com/en-US/editor?env=usa&lon=" + row.long + "&lat=" + row.lat + "&zoom=6&marker=true";
      var lmlink="https://www.waze.com/livemap?lon=" + row.long + "&lat=" + row.lat + "&zoom=17";
      var applink="https://www.waze.com/ul?ll=" + row.lat + "," + row.long;
      const exampleEmbed = {
        color: 0xffff00,
        title: row.title,
        //url: row.link,
        author: {
          name: 'DelDot DataFeed (Scheduled Closure)',
          icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
          url: 'https://deldot.gov',
        },
        //description: row.desc,
        thumbnail: {
          url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
        },
        fields: [
          {
            name: 'Reason',
            value: row.desc,
          },
          {
            name: 'Location',
            value: `[WME Link](${wmelink}) | [Livemap Link](${lmlink}) | [App Link](${applink})`,
          },
          {
            name: 'Dates',
            value: row.starttime,
          },
          {
            name: 'County',
            value: row.county,
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false,
          },
        ],
        footer: {
          text: "Scheduled Closure " + row.eventID,
          //icon_url: 'https://i.imgur.com/wSTFkRM.png',
        },
      };
      closureChannel.send({ embed: exampleEmbed });
      db.db.run("UPDATE closures SET posted='TRUE' WHERE eventID=" + `"${row.eventID}"`);
    });
    }
    catch (e) {
    console.log(e);
    db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
  }
  },
  //Update the advisory closures in the database - Remove the ones that are no longer in DelDot JSON file
  updateAdvisories: function updateAdvisories(closureChannel) {
    try {
    db.db.each("SELECT eventID, title, desc, timestamp, status, link, lat, long, address, type, wherename FROM closures WHERE status='Advisory'", function(err, row) {
    if (err) {
      throw err;
    }
    var closureindex = 0;
    var closurevalid = false;
    while (closureindex < pulldata.advisoryCount) {
      if (row.eventID == pulldata.advisoryResponse.advisories[closureindex].id) {
        closurevalid = true; //If closure is valid, do not remove from DB
      }
      closureindex++;
      }
    if (!closurevalid) {
      var wmelink="https://www.waze.com/en-US/editor?env=usa&lon=" + row.long + "&lat=" + row.lat + "&zoom=6&marker=true";
      var lmlink="https://www.waze.com/livemap?lon=${row.long}&lat=${row.lat}&zoom=17";
      var applink="https://www.waze.com/ul?ll=" + row.lat + "," + row.long;
      if (row.address == "null") {
        var wherename = row.wherename;
      } else { 
        var wherename = row.address; 
      }
      const exampleEmbed = {
        color: 0x00ff00,
        title: "Cleared! - " + row.type + " near " + wherename,
        url: row.link,
        author: {
          name: 'DelDot DataFeed (Advisory Closure)',
          icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
          url: 'https://deldot.gov',
        },
        //description: row.desc,
        thumbnail: {
          url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
        },
        fields: [
          {
            name: 'Reason',
            value: row.desc,
          },
          {
            name: 'Location',
            value: `[WME Link](${wmelink}) | [Livemap Link](${lmlink}) | [App Link](${applink})`,
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false,
          },
        ],
        timestamp: new Date(),
        footer: {
          text: "Event " + row.eventID + " cleared at ",
          //icon_url: 'https://i.imgur.com/wSTFkRM.png',
        },
      };
      closureChannel.send({ embed: exampleEmbed });
      console.log(row.eventID + " Deleted!");
      db.db.run("DELETE FROM closures WHERE eventID=" + row.eventID);
      }
    });
    }
    catch (e) {
    console.log(e);
    db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
    }
  },
  //Update the scheduled closures in the database - Remove the ones that are no longer in DelDot JSON file
  updateSchedules: function updateSchedules(closureChannel) {
    try {
    db.db.each("SELECT eventID, title, desc, county, lat, long FROM closures WHERE status='Scheduled'", function(err, row) {
    if (err) {
      throw err;
    }
    //var closureChannel = client.channels.cache.find(channel => channel.id === "726156388505747539");
    var closureindex = 0;
    var closurevalid = false;
    while (closureindex < pulldata.scheduleCount) {
        if (row.eventID == pulldata.scheduleResponse[closureindex].str.strId) {
          //closureChannel.send(row.eventID + " : " + advisoryResponse.advisories[closureindex].id);
          closurevalid = true; //If closure is valid, do not remove from DB
        }
      closureindex++;
      }
    if (!closurevalid) {
      var wmelink="https://www.waze.com/en-US/editor?env=usa&lon=" + row.long + "&lat=" + row.lat + "&zoom=6&marker=true";
      var lmlink="https://www.waze.com/livemap?lon=" + row.long + "&lat=" + row.lat + "&zoom=17";
      var applink="https://www.waze.com/ul?ll=" + row.lat + "," + row.long;
      const exampleEmbed = {
        color: 0x00ff00,
        title: "Cleared! - " + row.title,
        //url: row.link,
        author: {
          name: 'DelDot DataFeed (Schedule Closure)',
          icon_url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
          url: 'https://deldot.gov',
        },
        //description: row.desc,
        thumbnail: {
          url: 'https://news.delaware.gov/files/2020/03/2019-Updated-Logo-No-Shine.jpg',
        },
        fields: [
          {
            name: 'Reason',
            value: row.desc,
          },
          {
            name: 'Location',
            value: `[WME Link](${wmelink}) | [Livemap Link](${lmlink}) | [App Link](${applink})`,
          },
          {
            name: 'County',
            value: row.county,
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false,
          },
        ],
        timestamp: new Date(),
        footer: {
          text: "Closure " + row.eventID + " cleared at ",
          //icon_url: 'https://i.imgur.com/wSTFkRM.png',
        },
      };
      closureChannel.send({ embed: exampleEmbed });
      console.log(row.eventID + " Deleted!");
      db.db.run("DELETE FROM closures WHERE eventID=" + row.eventID);
      }
    });
    }
    catch (e) {
    console.log(e);
    db.db.run(`INSERT INTO errlog (timestamp, err) VALUES ("${new Date()}","${e}")`);
    }
  }
}