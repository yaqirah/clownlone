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
const keywords = ["clown", "jester", "circus", "joke", "fool", "clownbot", "trick", "joker", "prank"];
const shammykeywords = ["shammy", "shammyclown", "mona"];
const admins = [absol, shammy];
const yesnoquestions = ["does", "do", "did", "can", "will", "is", "are", "could", "would", "should", "shall"];

// emotes
var clown = "<:looseclown:892945490730184745>";
var shammy_clown = "<:shammyclown:892945388217192489>";
var allowed = "<:allowed:893221037053968404>";
var not_allowed = "<:notallowed:893221037465010196>";

//songs
var sendintheclowns = ["Isn't it rich?", "Are we a pair?", "Me here at last on the ground", "You in mid-air", "Send in the clowns", "Isn't it bliss?", "Don't you approve?", "One who keeps tearing around", "One who can't move", "Where are the clowns?", "Send in the clowns", "Just when I stopped", "Opening doors", "Finally knowing the one that I wanted was yours", "Making my entrance again with my usual flair", "Sure of my lines", "Noone is there", "Don't you love a farce?", "My fault, I fear", "I thought that you'd want what I want", "Sorry my dear", "But where are the clowns?", "Send in the clowns", "Don't bother", "They're here"]
var sendintheclowns2 =[] //punctuation free version

//when bot is activated
client.on("ready", () => {
	client.user.setGame(action)
	console.log(keyword + "!");
	for (var k=0; k<sendintheclowns.length; k++) {
		sendintheclowns2.push(remove_punc(sendintheclowns[k]));
	}
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
			// use format of send [id] [message]
			if(message.content.toLowerCase().startsWith("send")){
				var type = message.content.substring(5, 9);
				var id = message.content.substring(10, 28);
				var msg = message.content.substring(29);
				
				// check if id is valid
				if(id.match(/^[0-9]+$/) == null){
					message.author.send("invalid id");
					return;
				}
				
				if(type == "chnl"){
					console.log(msg);
					client.channels.get(id).send(msg);
				}else if(type == "user"){
					client.users.get(id).send(msg);
				}
			}
			
			//status
			if (has("status", message)) {
				client.user.setGame(message.content.substring(7,message.content.length));
				return;
			}
		}else{
			message.author.send("UNAUTHORIZED");
			client.user.setGame(message.author.username + " is clowning");
		}
	}
	
	var clownssent = false;
	//sing with me clown
	for (var i = 0; i<sendintheclowns2.length-1; i++) { //check through lyrics
		if (remove_punc(message.content) == sendintheclowns2[i]) { //find which specifically
			message.channel.send(sendintheclowns[i+1]); //send next lyric
			clownssent=true; // we sang!!
			break;
		}
	}
	
	if (clownssent==true) {return;} //were we able to sing?
	
	// if yes or no question
	if (yesorno(yesnoquestions,message))  {
		if(Math.round(Math.random()) == 0){
			if(check_keywords(shammykeywords,message)) {
				message.channel.send("", {files:["ls\\32.png"]});
			} else if(check_keywords(keywords,message)) {
				message.channel.send("", {files:["lc\\03.png"]});
			} else {
				message.react(simple_emote(allowed));
			}
		}else{
			if(check_keywords(shammykeywords,message)) {
				message.channel.send("", {files:["ls\\30.png"]});
			} else if(check_keywords(keywords,message)) {
				message.channel.send("", {files:["lc\\02.png"]});
			} else {
				message.react(simple_emote(not_allowed));
			}
		}
	//if shammy
	} else if(check_keywords(shammykeywords,message)){
		message.react(simple_emote(shammy_clown));
		message.channel.send("", {files:["ls\\" + random_int(43) + ".png"]});
		
	//if clown
	} else if(check_keywords(keywords,message)){
		message.react(simple_emote(clown));
		message.channel.send("", {files:["lc\\" + random_int(42) + ".png"]});
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
	var result = kw.some(word => has(word, msg));
	return result;
}

// Check if a question is yes or no answerable.
function yesorno (kw,msg) {
	var result = 0;
	let newmsg = {
		content: ""
	}
	let firstWord = {
		content: ""
	}
	newmsg.content = msg.content // variable to hold the edited string in.
	var clownprefix = which_keywords(keywords.concat(shammykeywords),msg); // find if the user addresses clown first
	if (msg.content.startsWith(clownprefix)) {
		newmsg.content=msg.content.substring(clownprefix.length, msg.content.length); //cut off any clown prefix
		newmsg.content=newmsg.content.replace(",", ""); //remove any commas
		newmsg.content=newmsg.content.replace(".", ""); //remove any full stops
		newmsg.content=newmsg.content.replace(" ", ""); //remove any extra spaces
	}
	firstWord.content = newmsg.content.replace(/ .*/,'');
	if (newmsg.content.charAt(newmsg.content.length - 1) == "?") { 
		result+=1;
	}
	if (newmsg.content.toLowerCase().startsWith(which_keywords(kw,firstWord))) {
		result+=1;
	}
	return Math.floor(result/2);
}

//find a specific keyword from a group
function which_keywords(kw,msg){
	var resultword = "null";
	for (var i=0; i<kw.length; i++) {
		if (has(kw[i],msg)) {
			resultword=kw[i]
		}
	}
	return resultword;
	
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