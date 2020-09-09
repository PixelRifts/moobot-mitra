Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

async function getPokemon(message, pokemonName) {
    try {
        return await Pokedex.getPokemonByName(pokemonName);
    } catch (error) {
        message.reply(`There was an error fetching Data for the Pokemon ${pokemonName}`);
        return;
    }
}

function showPokemon(message, pokemonName) {
    message.channel.send('http://play.pokemonshowdown.com/sprites/ani/' + pokemonName + '.gif');
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

module.exports = {
    name: 'pokemon',
    description: 'Get info of pokemon!',
    args: true,
	execute(message, args) {
        const pokemonName = args[0];
        const operation = args[1];
        switch (operation) {
            case 'show': showPokemon(message, pokemonName); break;
            case 'abilities': listAbilities(message, pokemonName); break;
        }
	}
}