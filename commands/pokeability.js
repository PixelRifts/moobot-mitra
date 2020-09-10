Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

async function getAbility(message, pokemonName) {
    try {
        return await Pokedex.getAbilityByName(pokemonName);
    } catch (error) {}
}

module.exports = {
    name: 'pokeability',
    description: 'Get info of Abilities',
    args: {
		compulsary: 1,
    },
    cooldown: 5,
    expected: '/pokeability <Ability Name>',
    execute(message, args) {
        const abilityName = args[0];
        Pokedex.getAbilityByName(abilityName).then(response => {
            message.reply(`${response.effect_entries[1].effect}`);
        }).catch(error => {});
    }
}