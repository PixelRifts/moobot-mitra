const Discord = require('discord.js');

Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

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
            let retval = ''; 
            for (let e of effect_entries) {
                if (e.language.name === 'en') {
                    retval = e.effect;
                }
            }
            if (retval == '') retval = 'None';
            let embed = new Discord.MessageEmbed()
                    .setColor('#cc22cc')
                    .setTitle(global.fixTitle(moveName))
                    .addFields(
                        { name: 'Damage Class', value: capitalize(response.damage_class.name), inline: true },
                        { name: 'Accuracy', value: response.accuracy, inline: true },

                        { name: 'Effect', value: retval },

                        { name: 'Power', value: response.power, inline: true },
                        { name: 'PP', value: response.pp, inline: true },
                        { name: 'Type', value: capitalize(response.type.name), inline: true },
                    );
            message.reply(embed);
        }).catch(error => {console.log(error);});
    }
}