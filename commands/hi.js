module.exports = {
    name: 'hi',
	description: 'Hello there!',
	args: false,
	execute(message, args) {
		message.channel.send(`Hi there`);
	},
}