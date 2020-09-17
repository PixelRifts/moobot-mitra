module.exports = {
    name: 'abort',
    description: '',
    args: false,
    cooldown: 5,
    expected: '/abort',
    execute(message, args) {
        let i = global.RunningMTTGames.findIndex(game => {
            return game.p1 == message.author || game.p2 == message.author;
        });
        if (i < 0) {
            message.reply('You are not in a game! /abort aborts the game you have entered!');  
            return;
        }
        let g = global.RunningMTTGames[i];
        message.channel.send(`Game aborted! ${g.p1.toString()} and ${g.p2.toString()} by ${message.author.toString()}`);
        global.RunningMTTGames.splice(i, 1);
    }
}