const Discord = require('discord.js');

Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

module.exports = {
    name: 'pokeberry',
    description: 'Get info of Berries',
    args: true,
    cooldown: 5,
    expected: '/pokeberry <Berry Name>',
    execute(message, args) {
        const berryName = args[0];
        Pokedex.getBerryByName(berryName).then(berryResponse => {
                let itemName = berryResponse.item.name;
                Pokedex.getItemByName(itemName).then(berryItemResponse => {
                        let effect_entries = berryItemResponse.effect_entries;
                        let retval = ''; 
                        for (let e of effect_entries) {
                            if (e.language.name === 'en') {
                                retval = e.effect;
                            }
                        }

                        let flavors = berryResponse.flavors;
                        let flavorString = '';
                        for (let f of flavors) {
                            flavorString = flavorString.concat(f.flavor.name).concat(' ');
                        }
                        flavorString = flavorString === '' ? 'NONE' : flavorString;

                        let embed = new Discord.MessageEmbed()
                                .setTitle(global.fixTitle(berryName + ' Berry'))
                                .setImage(berryItemResponse.sprites.default)
                                .addFields(
                                    { name: 'Flavours', value: flavorString, inline: true },
                                    { name: 'Firmness', value: global.fixTitle(berryResponse.firmness.name), inline: true },
                                    
                                    { name: 'Effect', value: retval },

                                    { name: 'Natural Gift Power', value: berryResponse.natural_gift_power, inline: true },
                                    { name: 'Natural Gift Type', value: global.capitalize(berryResponse.natural_gift_type.name), inline: true },
                                );
                        message.reply(embed);
                });
        });
    }
}