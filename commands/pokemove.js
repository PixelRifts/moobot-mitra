const Discord = require('discord.js');

Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

function capitalize (string) {
	return [].map.call(string, (char, i) => i ? char : char.toUpperCase()).join('');
}

module.exports = {
    name: 'pokemove',
    description: 'Get info on moves',
    args: true,
    cooldown: 5,
    expected: '/pokemove <Move Name>',
    execute(message, args) {
        const moveName = args[0];
        Pokedex.getMoveByName(moveName).then(response => {
            let effect_entries = response.effect_entries;
            var retval = ''; 
            for (let e of effect_entries) {
                if (e.language.name === 'en') {
                    retval = e.effect;
                }
            }
            let embed = new Discord.MessageEmbed()
                    .setColor('#cc22cc')
                    .setTitle(capitalize(moveName))
                    .addFields(
                        { name: 'Type', value: capitalize(response.damage_class.name), inline: true },
                        { name: 'Accuracy', value: response.accuracy, inline: true },

                        { name: 'Effect', value: retval },

                        { name: 'Power', value: response.power, inline: true },
                        { name: 'PP', value: response.pp, inline: true },
                        { name: 'Type', value: capitalize(response.type.name), inline: true },
                    );
            message.reply(embed);
        }).catch(error => {});
    }
}