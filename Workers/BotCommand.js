const db = require('./DB.js');              //Sqlite3 DB functions

module.exports = {
  botComm: function botComm(client,message,closureChannel) {
    if ((message.author.id == "356869234942410753") || (message.author.id == "211119394992947200")) {
      if (message.content == "!commands") {
        message.author.send("My commands are:");
        message.author.send("!ping - See if I'm alive");
        message.author.send("!showsql - Show current records in DB");
        message.author.send("!clearDB - Clear all DB records");
        message.author.send("!sql [SQL STATEMENT] - Execute custom SQL statement");
      }
      if (message.content == "!owner") {
        message.author.send("phuz owns me.");
      }
      if (message.content == "!testcommand5") {
        message.channel.send("pong!");
      }
      if (message.content.includes("!sql")) {
        customSQLcommand(message,closureChannel);
      }
      if (message.content.includes("!clearDB")) {
        db.db.run("DELETE FROM closures");
        message.channel.send("DB Cleared!");
      }
      if (message.content == "!showsql") {
        db.db.each("SELECT * FROM closures", function(err, row) {
            if (err) throw err;
            message.channel.send(row.eventID + " : " + row.posted);
            });
      }
      // We'll call it 'reaction' for short, but it is actually a 'MessageReaction' object
    }
  }
}
  //Custom SQL Commands from Discord
function customSQLcommand(message,closureChannel) {
  query = message.content.replace("!sql ", "");
  db.db.all(query, function (err,row) {
    console.log(row.length);
    var x = 0;
    if (message.content.includes("SELECT") === true) {
      if (row.length === 0) {
        message.channel.send("No Records Returned.");
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
