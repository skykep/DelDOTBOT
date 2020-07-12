const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
var botcmd = require('./Workers/BotCommand.js'); //Bot Commands
var DE = require('./States/DE.js');	
require('dotenv').config();

console.log(new Date().toLocaleString() + " ::: Starting Cient...");
setInterval(function() { DE.Pull(client); }, 60000);

client.on('ready', () => {
	console.log("I'm in");
	DE.Pull(client);
});

client.on('message', function(message) {
	//console.log(new Date() + " : " + message.author.username);
	if ((message.channel.id === config.DE.ClosureChannel) || (message.channel.id === "728227545681494066") || (message.channel.id === "729735421818568774")) {
		if (message.content === "!ping") {
			message.channel.send("pong!");
		}
		if ((message.author.id === "356869234942410753") || (message.author.id === "211119394992947200")) {
			if (message.content === "!reload") {
				delete require.cache[require.resolve('./Workers/BotCommand.js')];
				delete require.cache[require.resolve('./Workers/Embeds.js')];
				delete require.cache[require.resolve('./Workers/ReturnData.js')];
				delete require.cache[require.resolve('./States/DE.js')];
				delete require.cache[require.resolve('./config.json')];
				botcmd = require('./Workers/BotCommand.js');
				DE = require('./States/DE.js');
				message.channel.send("Modules Reloaded.");
			} 
			if (message.content === "!kill") {
				process.exit();
			}
			if (message.content === "!reboot") {
				message.channel.send("Rebooting the VM.\nBRB!");
				require('child_process').exec('sudo /sbin/shutdown -r now', function (msg) { console.log(msg) });
			} else {
				botcmd.botComm(client, message);
			}
		}
	}
});

client.on('messageReactionAdd', (reaction, user) => {
	let message = reaction.message, emoji = reaction.emoji.name;
	//console.log(message.author.id);
	//console.log(message.id);
	if (emoji === '❌') {
		//message.channel.send("Thanks for closing it.");
	}
	if (emoji === "🖕") {          //:middle_finger:
		message.channel.send("WTF?");
	}
});

client.login(process.env.DiscordToken);