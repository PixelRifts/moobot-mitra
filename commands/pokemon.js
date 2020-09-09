const Pokedex = require('pokeapi-js-wrapper');
const Discord = require('discord.js');
const P = new Pokedex.Pokedex();

module.exports = {
    name: 'pokemon',
	description: 'Get info of pokemon!',
	execute(message, args) {
        console.log(args);
        try {
            P.getPokemonByName(args[0]).then(function(response) {
                message.channel.send('http://play.pokemonshowdown.com/sprites/ani/' + response.name + '.gif');
                console.log(response.name);
            });
        } catch (error) {
            console.log(error);
            message.reply('No such Pokemon found');
        }
	},
}