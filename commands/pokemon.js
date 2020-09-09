const Discord = require('discord.js');

module.exports = {
    name: 'pokemon',
	description: 'Get info of pokemon!',
	execute(message, args) {
        message.reply('http://play.pokemonshowdown.com/sprites/ani/' + response.name + '.gif');
	},
}