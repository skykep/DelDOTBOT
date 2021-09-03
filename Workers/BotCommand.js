const sql = require('./DB.js');              //Sqlite3 DB functions
const fetch = require('node-fetch');

module.exports = {
  botComm: function botComm(client,message) {
    if ((message.author.id == "356869234942410753") || (message.author.id == "211119394992947200") || (message.author.id == "300591409218584577")) { //phuz and doctorblah and poncewattle IDs
      if (message.content == "!help") {
			message.channel.send("My commands are:\n!ping - See if I'm alive\n!showsql - Show current records in DB\n!purge - Clear all DB records\n!reload - Reload Modules\n!sql [SQL STATEMENT] - Execute custom SQL statement");
      }
      if (message.content == "!owner") {
			message.author.send("phuz owns me.");
      }
      if (message.content.includes("!sql")) {
			customSQLcommand(message);
      }
		if (message.content.startsWith("!find ")) {
			url = message.content.replace("!find ","");
			url = url.replace(/ /g, '%20');
			url = "https://w-tools.org/api/SegmentFinder?find=" + url;
			fetch(url)
			.then(response => response.json())
			.then(advisoryResponse => {
				if (advisoryResponse.wmePermalink != null) {
				message.channel.send("<" + advisoryResponse.wmePermalink + ">");
				console.log(advisoryResponse);
				} else {
					message.channel.send("No Segment Found.");
				}
			})
		}
      if (message.content.includes("!purge")) {
			sql.db.run("DELETE FROM closures");
			message.channel.send("DB Cleared!");
      }
      if (message.content == "!showsql") {
			sql.db.each("SELECT * FROM closures", function(err, row) {
            if (err) throw err;
            message.channel.send(row.EventID + " \ " + row.TimeStamp + " \ <" + row.MessageID + ">");
            });
      }
      // We'll call it 'reaction' for short, but it is actually a 'MessageReaction' object
    }
  },
  userCommand: function userComm(client,message) {
	 if (message.channel.type == "dm") {
			if (message.content.startsWith("!find ")) {
				url = message.content.replace("!find ","");
				url = url.replace(/ /g, '%20');
				url = "https://w-tools.org/api/SegmentFinder?find=" + url;
				fetch(url)
				.then(response => response.json())
				.then(advisoryResponse => {
					if (advisoryResponse.wmePermalink != null) {
					message.channel.send("<" + advisoryResponse.wmePermalink + ">");
					} else {
						message.channel.send("No Segment Found.");
					}
					console.log(message.author.username  + " requested a find");
				})
			}
		}
	}
}
  //Custom SQL Commands from Discord
function customSQLcommand(message) {
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
