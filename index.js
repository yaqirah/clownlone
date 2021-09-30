require('dotenv').load();
const Discord = require("discord.js");
const client = new Discord.Client({autoReconnect: true});

var name = "Clown";
var action = "clowning";
var keyword = "clown";

//keywords etc
const keywords = ["clown", "jester", "circus", "jokes", "fool"];
const shammykeywords = ["shammy", "shammyclown", "mona"];

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
	
	if(keywords.some(word => message.content.includes(word))){
		message.channel.send("", {files:["lc//" + random_int(42) + ".png"]});
		
		if(message.content.charAt(message.content.length - 1) == "?"){ // ends with ?
			if(Math.round(Math.random()) == 0){
				message.react(simple_emote(allowed));
				message.channel.send(allowed);
			}else{
				message.react(simple_emote(not_allowed));
				message.channel.send(not_allowed);
			}
		}else{
			message.channel.send(clown);
		}
	}else if(shammykeywords.some(word => message.content.includes(word))){
		message.channel.send("", {files:["sc//" + random_int(43) + ".png"]});
	}
});

// strip the name and brackets from an emote to get the simple format
function simple_emote(string){
	var start = string.lastIndexOf(":") + 1;
	var end = string.length - 1;
	var result = string.substring(start,end);
	return result;
}

// generate a random number between 1 and max
function random_int(max){
	return String(Math.floor((Math.random() * max) + 1)).padStart(2, '0');
}

client.login(process.env.TOKEN)
