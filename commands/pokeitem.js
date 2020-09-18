const Discord = require('discord.js');

Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

module.exports = {
    name: 'pokeitem',
    description: 'Get info of Items',
    args: true,
    cooldown: 5,
    expected: '/pokeitem <Item Name>',
    execute(message, args) {
        const itemName = args[0];
        Pokedex.getItemByName(itemName).then(response => {
            let effect_entries = response.effect_entries;
            var retval = ''; 
            for (let e of effect_entries) {
                if (e.language.name === 'en') {
                    retval = e.effect;
                }
            }
            let embed = new Discord.MessageEmbed()
                    .setTitle(global.fixTitle(itemName))
                    .setImage(response.sprites.default)
                    .addField('Effect', retval);
            message.reply(embed);
        });
    }
}