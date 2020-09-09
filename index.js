const FileSystem = require('fs');
const Discord = require('discord.js');
const Client = new Discord.Client();
Client.commands = new Discord.Collection();
const DEV = false;

const commandFiles = FileSystem.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	Client.commands.set(command.name, command);
}

const PREFIX = '/';

Client.on('ready', () => {
    console.log('MooBot is online! Say Hi everyone!!');
});

Client.on('message', message => {
	if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = Client.commands.get(commandName);
    console.log(args);

    if (command.args && !args.length) {
    	return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

if (DEV) {
    FileSystem.readFile("token.txt", "utf8", (err, data) => {
        Client.login(data);
    });
} else {
    Client.login(process.env.BOT_TOKEN);
}