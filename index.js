const FileSystem = require('fs');
const Discord = require('discord.js');

const Client = new Discord.Client();
Client.commands = new Discord.Collection();

// //////////////// //
// GLOBAL FUNCTIONS //
// //////////////// //
global.DEV = false;

global.capitalize = function(string) {
	return [].map.call(string, (char, i) => i ? char : char.toUpperCase()).join('');
}

global.fixTitle = function(string) {
    let blocks = string.split('-');
    let retval = '';
    for (let block of blocks) {
        retval = retval.concat(capitalize(block)).concat(' ');
    }
    return retval;
}

const commandFiles = FileSystem.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	Client.commands.set(command.name, command);
}
global.PREFIX = '/';
global.SPAM_COUNT = 4;

const cooldowns = new Discord.Collection();

const recentMessages = {}

Client.on('ready', () => {
    console.log('MooBot is online! Say Hi everyone!!');
});

Client.on('message', message => {
	if (message.author == 743900942788722708)
		message.delete();
	if (!message.author.bot)
		if (recentMessages[message.author.id] == null) {
			recentMessages[message.author.id] = [];
			recentMessages[message.author.id].push(message.content);
		} else {
			recentMessages[message.author.id].push(message.content);
			if (recentMessages[message.author.id].length > global.SPAM_COUNT) {
				recentMessages[message.author.id].splice(0, 1);
			}
			let c = 0;
			for (let i = 0; i < recentMessages[message.author.id].length; i++) {
				if (recentMessages[message.author.id][i] == recentMessages[message.author.id][0]) {
					c++;
				}
			}
			if (c >= global.SPAM_COUNT) {
				recentMessages[message.author.id].pop();
				message.author.send("Stop spamming bitch. :eyes:");
				message.delete();
			}
		}
	if (!message.content.startsWith(global.PREFIX) || message.author.bot) return;

	// //////////////////////// //
	// Command Argument Parsing //
	// //////////////////////// //

	const args = message.content.slice(global.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
	const command = Client.commands.get(commandName)
		|| Client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	if (command.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}! \n Expected: ${command.expected}`);
    }

	// ///////////////// //
	// Command Cooldowns //
	// ///////////////// //

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;
	
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	} else {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	// ///////////////// //
	// Command Executing //
	// ///////////////// //

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

module.exports.parseMention = function(mention) {
    if (!mention) return;
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
		return Client.users.cache.get(mention);
	}
}

if (global.DEV) {
    FileSystem.readFile("token.txt", "utf8", (err, data) => {
        Client.login(data);
    });
} else {
    Client.login(process.env.BOT_TOKEN);
}