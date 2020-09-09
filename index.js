const FileSystem = require('fs');
const Discord = require('discord.js');
const Client = new Discord.Client();
Client.commands = new Discord.Collection();
const DEV = true;

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
	const command = args.shift().toLowerCase();

    try {
        Client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

if (DEV) {
    FileSystem.readFile("token.txt", "utf8", (err, data) => {
        Client.login(data);
    });
} else {
    Client.login(process.env.BOT_TOKEN);
}