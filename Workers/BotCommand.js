const sql = require('./DB.js');              //Sqlite3 DB functions

module.exports = {
  botComm: function botComm(client,message,closureChannel) {
    if ((message.author.id == "356869234942410753") || (message.author.id == "211119394992947200")) { //phuz and doctorblah IDs
      if (message.content == "!help") {
			message.channel.send("My commands are:\n!ping - See if I'm alive\n!showsql - Show current records in DB\n!purge - Clear all DB records\n!reload - Reload Modules\n!sql [SQL STATEMENT] - Execute custom SQL statement");
      }
      if (message.content == "!owner") {
			message.author.send("phuz owns me.");
      }
      if (message.content.includes("!sql")) {
			customSQLcommand(message,closureChannel);
      }
		if (message.content.includes("!1")) {
			query='INSERT INTO closures (EventID, Desc, TimeStamp, EventType, AdvisoryType, Link, MessageID, Lat, Lon, Address, County) VALUES ("1234","test","2020-07-09T06:45:53Z","Advisory","Adv Test","http://www.waze.com","31337","40","-76","test address","Sussex")';
			sql.db.run(query);
			message.channel.send(query);
      }
		if (message.content.includes("!2")) {
			query='INSERT INTO closures (EventID, Desc, TimeStamp, EventType, AdvisoryType, Link, MessageID, Lat, Lon, Address, County) VALUES ("12345","test","06/05/2020 12:00 AM to 08/14/2020 12:00 AM","Scheduled","Adv Test","8243","31337","40","-76","test address","Sussex")';
			sql.db.run(query);
			message.channel.send(query);
      }
      if (message.content.includes("!purge")) {
			sql.db.run("DELETE FROM closures");
			message.channel.send("DB Cleared!");
      }
		if (message.content.includes("!think")) {
			thoughtchannel = client.channels.cache.find(channel => channel.id === "730093980628549664");
			thoughtchannel.send("\:thinking:");
      }
      if (message.content == "!showsql") {
			sql.db.each("SELECT * FROM closures", function(err, row) {
            if (err) throw err;
            message.channel.send(row.EventID + " \ " + row.TimeStamp + " \ <" + row.MessageID + ">");
            });
      }
      // We'll call it 'reaction' for short, but it is actually a 'MessageReaction' object
    }
  }
}
  //Custom SQL Commands from Discord
function customSQLcommand(message,closureChannel) {
  query = message.content.replace("!sql ", "");
  sql.db.all(query, function (err,row) {
    console.log(row.length);
    var x = 0;
    if (message.content.includes("SELECT") === true) {
      if (row.length === 0) {
        message.channel.send("No Records Returned.");
      } else {
			  while (x<row.length) {
				 console.log(row[x]);
				 message.channel.send(JSON.stringify(row[x]));
				 x++;
			  }
		}
    } else if (row.length === 0) {
      message.channel.send("Executed.");
    }
      else {
        while (x<row.length) {
          console.log(row[x]);
          message.channel.send(JSON.stringify(row[x]));
          x++;
        }
      }

  })
}
