require('dotenv').load();
const Discord = require("discord.js");
const client = new Discord.Client({autoReconnect: true});

var name = "Beta";
var action = "coding";
var keyword = "clown";

// emotes
var clown = "<:looseclown:892945490730184745>";
var shammy_clown = "<:shammyclown:892945388217192489>";
var allowed = "<:allowed:803132424400928769>";
var not_allowed = "<:notallowed:803156238673248297>";

//when bot is activated
client.on("ready", () => {
	client.user.setGame(action)
	console.log(keyword + "!");
});

//new message sent
client.on("message", async message => {
	if(message.author.bot){return;}
	if (!message.guild){ return};
	
	if(message.content.includes(keyword)){
		if(message.content.charAt(message.content.length - 1) == "?"){ // ends with ?
			if(Math.round(Math.random()) == 0){
				message.channel.send(allowed);
			}else{
				message.channel.send(not_allowed);
			}
		}else{
			message.channel.send(clown);
		}
	}else if(message.content.includes("shammy")){
		message.channel.send(shammy_clown);
	}
});
client.login(process.env.TOKEN)
