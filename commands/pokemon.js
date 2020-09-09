module.exports = {
    name: 'pokemon',
	description: 'Get info of pokemon!',
	execute(message, args) {
        console.log(args);
        message.channel.send('http://play.pokemonshowdown.com/sprites/ani/' + args[0] + '.gif');
	}
}