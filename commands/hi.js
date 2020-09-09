module.exports = {
    name: 'hi',
	description: 'Hello there!',
	execute(message, args) {
		message.channel.send(`Hi there`);
	},
}