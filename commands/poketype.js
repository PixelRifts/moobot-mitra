const Discord = require('discord.js');

Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

module.exports = {
    name: 'poketype',
    description: 'Get info on types',
    args: true,
    cooldown: 2,
    expected: '/poketype <Type Name>',
    execute(message, args) {
        const typeName = args[0];
        Pokedex.getTypeByName(typeName).then(response => {
            let doubleDamageTo = '';
            let doubleDamageFrom = '';
            let halfDamageTo = '';
            let halfDamageFrom = '';
            let noDamageTo = '';
            let noDamageFrom = '';
            for (let s of response.damage_relations.double_damage_to) doubleDamageTo = doubleDamageTo.concat(s.name).concat(' ');
            for (let s of response.damage_relations.double_damage_from) doubleDamageFrom = doubleDamageFrom.concat(s.name).concat(' ');
            for (let s of response.damage_relations.half_damage_to) halfDamageTo = halfDamageTo.concat(s.name).concat(' ');
            for (let s of response.damage_relations.half_damage_from) halfDamageFrom = halfDamageFrom.concat(s.name).concat(' ');
            for (let s of response.damage_relations.no_damage_to) noDamageTo = noDamageTo.concat(s.name).concat(' ');
            for (let s of response.damage_relations.no_damage_from) noDamageFrom = noDamageFrom.concat(s.name).concat(' ');
            doubleDamageTo = doubleDamageTo === '' ? 'NONE' : doubleDamageTo;
            doubleDamageFrom = doubleDamageFrom === '' ? 'NONE' : doubleDamageFrom;
            halfDamageTo = halfDamageTo === '' ? 'NONE' : halfDamageTo;
            halfDamageFrom = halfDamageFrom === '' ? 'NONE' : halfDamageFrom;
            noDamageTo = noDamageTo === '' ? 'NONE' : noDamageTo;
            noDamageFrom = noDamageFrom === '' ? 'NONE' : noDamageFrom;
            
            let embed = new Discord.MessageEmbed()
                    .setColor('#22cccc')
                    .setTitle(global.fixTitle(typeName))
                    .addFields(
                        { name: 'Move Damage Class', value: global.capitalize(response.move_damage_class.name) },

                        { name: 'Double Damage To', value: global.capitalize(doubleDamageTo), inline: true },
                        { name: 'Double Damage From', value: global.capitalize(doubleDamageFrom), inline: true },
                        { name: 'Half Damage To', value: global.capitalize(halfDamageTo), inline: true },
                        { name: 'Half Damage From', value: global.capitalize(halfDamageFrom), inline: true },
                        { name: 'No Damage To', value: global.capitalize(noDamageTo), inline: true },
                        { name: 'No Damage From', value: global.capitalize(noDamageFrom), inline: true }
                    );
            message.reply(embed);
        }).catch(error => {console.log(error);});
    }
}