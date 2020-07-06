const Discord     = require('discord.js');
const keep_alive  = require('./keep_alive.js');
const embeds      = require('./Workers/Embeds.js');     //Embed to Discord functions
const db          = require('./Workers/DB.js');         //Sqlite3 DB functions
const pulldata    = require('./Workers/PullData.js');   //DelDot JSON feeds
var botcmd        = require('./Workers/BotCommand.js'); //Bot Commands
require('dotenv').config();
const client      = new Discord.Client();
const token       = process.env.DISCORD_BOT_SECRET;
var closureChannel;

//embed Advisories to Discord
setInterval(function() { embeds.embedAdvisories(closureChannel) }, 20000);
//embed Schedules to Discord
setInterval(function() { embeds.embedSchedules(closureChannel) }, 20000);
//update closures in DB
setInterval(function() { embeds.updateAdvisories(closureChannel) }, 20000);
//update closures in DB
setInterval(function() { embeds.updateSchedules(closureChannel) }, 20000);

client.on('ready', () => {
  console.log("I'm in");
  closureChannel = client.channels.cache.find(channel => channel.id === "727658723207544873");
});
client.login(token);

client.on('message', function(message) {
  //console.log(new Date() + " : " + message.author.username);
  if (message.content == "!ping") {
    message.channel.send("pong!");
  }
  else if (message.content == "!reload") {
	delete require.cache[require.resolve('./Workers/BotCommand.js')];
	botcmd = require('./Workers/BotCommand.js');
    	message.channel.send("BotCommand updated.");
  }
  else {
    botcmd.botComm(client, message, closureChannel);
  }

});

client.on('messageReactionAdd', (reaction, user) => {
  let message = reaction.message, emoji = reaction.emoji.name;
  if (message.author.id == "726154987880579092") {
    console.log(message.author.id);
    console.log(message.id);
    if (emoji == '❌') {
      message.channel.send("Thanks for closing it.");
    }
    if (emoji == "🖕") {          //:middle_finger:
      message.channel.send("WTF?");
    }
  }
});


//  db.db.run("DELETE FROM closures");
//  db.db.run("DROP TABLE closures");
