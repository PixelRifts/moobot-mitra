const Discord = require('discord.js');

Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

const pokembed = new Discord.MessageEmbed()
		.setColor('#ee3355');


// //////////////// //
// Helper Functions //
// //////////////// //

function capitalize (string) {
	return [].map.call(string, (char, i) => i ? char : char.toUpperCase()).join('');
}

function manipulate_title(string) {
	var capitalized = capitalize(string);
	var retval = '';
	if (capitalized.endsWith('-mega')) {
		capitalized = capitalized.substr(0, capitalized.length - 5);
		retval = 'Mega ';
	} else if (capitalized.endsWith('-megax')) {
		capitalized = capitalized.substr(0, capitalized.length - 6).concat(' X');
		retval = 'Mega ';
	} else if (capitalized.endsWith('-megay')) {
		capitalized = capitalized.substr(0, capitalized.length - 6).concat(' Y');
		retval = 'Mega ';
	} else if (capitalized.endsWith('-gmax')) {
		capitalized = capitalized.substr(0, capitalized.length - 5);
		retval = 'Gigantamax ';
	} else if (capitalized.endsWith('-alola')) {
		capitalized = capitalized.substr(0, capitalized.length - 6);
		retval = 'Alolan ';
	} else if (capitalized.endsWith('-galar')) {
		capitalized = capitalized.substr(0, capitalized.length - 6);
		retval = 'Galarian ';
	} else if (capitalized.endsWith('-eternamax')) {
		capitalized = capitalized.substr(0, capitalized.length - 10);
		retval = 'Eternamax ';
	}
	return retval.concat(capitalized);
}

async function getPokemon(message, pokemonName) {
    try {
        return await Pokedex.getPokemonByName(pokemonName);
    } catch (error) {
        message.reply(`There was an error fetching Data for the Pokemon ${pokemonName}`);
        return;
    }
}

// ////////// //
// Operations //
// ////////// //

function showPokemon(message, pokemonName) {
    message.channel.send(`http://play.pokemonshowdown.com/sprites/ani/${pokemonName}.gif`);
}

function listAbilities(message, pokemonName) {
    getPokemon(message, pokemonName).then(pkmn => {
        const abilities = pkmn.abilities;
        message.reply(`Here are the abilities of the Pokemon ${pokemonName}`);
        for (let a of abilities) {
            let h = a.is_hidden;
            var hidden_text;
            if (h) hidden_text = ' [Hidden Ability]'
            else hidden_text = '';
            message.channel.send(a.ability.name + hidden_text);
        }
    });
}

// /////// //
// Command // 
// /////// //

module.exports = {
    name: 'pokemon',
    description: 'Get info of pokemon!',
	args: true,
	cooldown: 5,
    expected: '/pokemon <Pokemon Name> [Action]',
	execute(message, args) {
		const pokemonName = args[0];
		if (args.length == 1) {
			message.reply(pokembed
				.setTitle(manipulate_title(pokemonName))
				.setImage(`http://play.pokemonshowdown.com/sprites/ani/${pokemonName}.gif`)
			);
		}
        const operation = args[1];
        switch (operation) {
            case 'show': showPokemon(message, pokemonName); break;
            case 'abilities': listAbilities(message, pokemonName); break;
        }
	}
}