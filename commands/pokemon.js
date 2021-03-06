const Discord = require('discord.js');

Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

// //////////////// //
// Helper Functions //
// //////////////// //

function manipulate_title(string) {
	let capitalized = global.capitalize(string);
	let blocks = capitalized.split('-');
	capitalized = blocks[0];
	if (capitalized == 'Tapu')
		return capitalized.concat(' ').concat(global.capitalize(blocks[1]));
	let prefix = blocks[1] ? global.capitalize(blocks[1]) : '';
	return prefix.concat(' ').concat(capitalized);
}

function reformatForGif(string) {
	if (string === 'deoxys-normal')	
		return 'deoxys';
	return string;
}

async function getPokemon(message, pokemonName) {
    try {
        return await Pokedex.getPokemonByName(pokemonName);
    } catch (error) {}
}

// ////////// //
// Operations //
// ////////// //

function showPokemon(message, pokemonName) {
    message.channel.send(`https://projectpokemon.org/images/normal-sprite/${pokemonName}.gif`);
}

function listAbilities(message, pokemonName) {
    getPokemon(message, pokemonName).then(pkmn => {
        const abilities = pkmn.abilities;
        message.reply(`Here are the abilities of the Pokemon ${pokemonName}`);
        for (let a of abilities) {
            let h = a.is_hidden;
            let hidden_text;
            if (h) hidden_text = ' [Hidden Ability]'
            else hidden_text = '';
            message.channel.send(a.ability.name + hidden_text);
        }
    });
}

function showPokemonEmbed(message, pokemonName) {
	getPokemon(message, pokemonName).then(pkmn => {
		let typestr = '';
		let reformattedName = reformatForGif(pokemonName);

		for (let t of pkmn.types)
			typestr = typestr.concat(global.capitalize(t.type.name)).concat(' ');

		message.reply(new Discord.MessageEmbed()
			.setColor('#ee3355')
			.setTitle(manipulate_title(pokemonName))
			.setImage(`https://projectpokemon.org/images/normal-sprite/${reformattedName}.gif`)
			.addFields(
				{ name: 'Type', value: typestr },
				{ name: 'HP', value: pkmn.stats[0].base_stat, inline: true },
				{ name: 'Attack', value: pkmn.stats[1].base_stat, inline: true },
				{ name: 'Defence', value: pkmn.stats[2].base_stat, inline: true },
				{ name: 'Sp.Attack', value: pkmn.stats[3].base_stat, inline: true },
				{ name: 'Sp.Defence', value: pkmn.stats[4].base_stat, inline: true },
				{ name: 'Speed', value: pkmn.stats[5].base_stat, inline: true },
			)
		);
	}).catch(err => {
		message.reply(`Pokemon ${pokemonName} not found! Make sure you have the correct spelling :D`)
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
    expected: '/pokemon <Pokemon Name> [Operation]',
	execute(message, args) {
		const pokemonName = args[0];
		if (args.length == 1) {
			showPokemonEmbed(message, pokemonName);
		}
        const operation = args[1];
        switch (operation) {
            case 'show': showPokemon(message, pokemonName); break;
            case 'abilities': listAbilities(message, pokemonName); break;
        }
	}
}