Pokemon = require('pokeapi-js-wrapper');
const Pokedex = new Pokemon.Pokedex();

module.exports = {
    name: 'moveset',
    description: 'Get moveset of Pokemon',
    args: true,
    cooldown: 5,
    expected: '/moveset <Pokemon Name> [all]',
    execute(message, args) {
        let pokemonName = args[0];
        Pokedex.getPokemonByName(pokemonName).then((response) => {
            let moves = response.moves;
            let str = '';
            for (let m of moves) {
                let latest_details = m.version_group_details[m.version_group_details.length - 1];
                if (args[1] === 'all') {
                    str = str.concat(global.fixTitle(m.move.name))
                            .concat(`: At Level ${latest_details.level_learned_at} by method ${global.fixTitle(latest_details.move_learn_method.name)}`)
                            .concat('\n');
                } else {
                    if (latest_details.move_learn_method.name !== 'level-up') continue;

                    str = str.concat(global.fixTitle(m.move.name))
                            .concat(`: At Level ${latest_details.level_learned_at}`)
                            .concat('\n');
                }
            }
            let blocks = [ str ];
            while (blocks[blocks.length - 1].length > 1999) {
                let current = blocks.pop();
                blocks.push(current.substring(0, 1999));
                blocks.push(current.substring(1999, str.length - 1));
            }
                
            for (let b of blocks) {
                message.channel.send(b);
            }
        });
    }
}