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
    args: true,
    cooldown: 5,
    expected: '/pokeability <Ability Name>',
    execute(message, args) {
        const abilityName = args[0];
        Pokedex.getAbilityByName(abilityName).then(response => {
            let effect_entries = response.effect_entries;
            var retval = ''; 
            for (let e of effect_entries) {
                if (e.language.name === 'en') {
                    console.log(e.effect);
                    retval = e.effect;
                }
            }
            message.reply(`${retval}`);
        }).catch(error => {});
    }
}