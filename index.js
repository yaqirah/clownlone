require('dotenv').load();
const Discord = require("discord.js");
const client = new Discord.Client({autoReconnect: true});

var name = "Clown";
var action = "clowning";
var keyword = "clown";

// user ids
var absol = "139808943185592320";
var shammy = "416723258449330186";

//keywords etc
const keywords = ["clown", "jester", "circus", "jokes", "fool"];
const shammykeywords = ["shammy", "shammyclown", "mona"];
const admins = [absol, shammy];

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
	if(message.channel.type == "dm"){
		if(admins.some(user => message.author.id == user)){
			// commands:
			// help
			if(has("help", message)){
				// TODO: make real help message so jolly can kill it if necessary
				message.author.send("There is no help");
				return;
			}
			
			// sleep
			if(has("sleep", message)){
				message.author.send("goodnight")
				.then(() => {console.log("Bot shut down by " + message.author.username)})
				.then(() => {process.exit();})
			}
			
			// send
			// use format of send [channel id] [message]
		}else{
			message.author.send("UNAUTHORIZED");
			client.user.setGame(message.author.username + " is clowning");
		}
	}
	
	if(check_keywords(shammykeywords,message)){
		message.react(simple_emote(shammy_clown));
		message.channel.send("", {files:["ls\\" + random_int(43) + ".png"]});
		
	} else if(check_keywords(keywords,message)){
		if(message.content.charAt(message.content.length - 1) == "?"){ // ends with ?
			if(Math.round(Math.random()) == 0){
				message.channel.send("", {files:["lc\\03.png"]});
			}else{
				message.channel.send("", {files:["lc\\02.png"]});
			}
		} else {
			message.react(simple_emote(clown));
			message.channel.send("", {files:["lc\\" + random_int(42) + ".png"]});
		}
	}
});

// strip the name and brackets from an emote to get the simple format
function simple_emote(string){
	var start = string.lastIndexOf(":") + 1;
	var end = string.length - 1;
	var result = string.substring(start,end);
	return result;
}

function check_keywords(kw,msg){
	var result = kw.some(word => has(word, msg))
	return result;
}

// helper function checking a singular keyword
function has(kw, msg){
	return msg.content.toLowerCase().includes(kw);
}

// remove any punctuation from a string
function remove_punc(string) {
	var remove = ["'", ",", "-", ".", "!", "?", "~", ":", ";", ")", "(", "/", "\\"];
	var newstr = string;
	for (var i=0; i<remove.length; i++) { //check through each of the disallowed characters.
		var howmany = 0; //find how many instances of a specified character.
		for (var j=0; j<newstr.length; j++) {
			if(newstr.charAt(j)==remove[i]) {
				howmany+=1;
			}
		}
		for (var j=0; j<howmany; j++) { //remove characters based on how many there are.
			newstr=newstr.replace(remove[i], '');
		}
	}
	return newstr.toLowerCase();
}

// generate a random number between 1 and max
function random_int(max){
	return String(Math.floor((Math.random() * max) + 1)).padStart(2, '0');
}

client.login(process.env.TOKEN)