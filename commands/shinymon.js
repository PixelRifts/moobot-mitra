module.exports = {
    name: 'shinymon',
    description: 'Show shiny version of pokemon',
    args: true,
    cooldown: 5,
    expected: '/shinymon <Pokemon Name>',
    execute(message, args) {
        let pokemonName = args[0];
        message.channel.send(`https://projectpokemon.org/images/shiny-sprite/${pokemonName}.gif`);
    }
}