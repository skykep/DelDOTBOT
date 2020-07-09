const Discord     = require('discord.js');
var botcmd        = require('./Workers/BotCommand.js'); //Bot Commands
var DE				= require('./States/DE.js');	
const client      = new Discord.Client();
require('dotenv').config();

console.log(new Date().toLocaleString() + " ::: Starting Cient...");
setInterval(function() { DE.Pull(client); }, 20000);

client.on('ready', () => {
	console.log("I'm in");
	closureChannel = client.channels.cache.find(channel => channel.id === "727658723207544873");
	DE.Pull(client);
});

client.on('message', function(message) {
	//console.log(new Date() + " : " + message.author.username);
	if (message.content == "!ping") {
		message.channel.send("pong!");
	} else if (message.content == "!reload") {
		delete require.cache[require.resolve('./Workers/BotCommand.js')];
		delete require.cache[require.resolve('./Workers/Embeds.js')];
		delete require.cache[require.resolve('./States/DE.js')];
		botcmd = require('./Workers/BotCommand.js');
		DE = require('./States/DE.js');
		message.channel.send("Modules Reloaded.");
	} else {
		botcmd.botComm(client, message, closureChannel);
	}
});

client.on('messageReactionAdd', (reaction, user) => {
	let message = reaction.message, emoji = reaction.emoji.name;
	if (message.author.id == "726154987880579092") {
		//console.log(message.author.id);
		//console.log(message.id);
		if (emoji == '❌') {
			message.channel.send("Thanks for closing it.");
		}
		if (emoji == "🖕") {          //:middle_finger:
			message.channel.send("WTF?");
		}
	}
});

client.login(process.env.DiscordToken);