const playtable = new Map([
    ['tl', 0],
    ['t',  1],
    ['tr', 2],
    ['l',  3],
    ['m',  4],
    ['r',  5],
    ['bl', 6],
    ['b',  7],
    ['br', 8],
]);

module.exports = {
    name: 'play',
    description: '',
    args: true,
    cooldown: 2,
    expected: '/play <Your Move>',
    execute(message, args) {
        var finishedGame;
        for (let game of global.RunningMTTGames) {
            if (game.p1 == message.author || game.p2 == message.author) {
                if (playtable.get(args[0]) == null){
                    message.reply("If you cant type a direction please leave.");
                    return;
                }
                if (game.play(message, message.author, playtable.get(args[0]))) {
                    finishedGame = game;
                    break;
                }
            } else {
                message.reply('You are not in a game! Use /mootactoe <Tag-Opponent> to begin a game!');
            }
        }
        const index = global.RunningMTTGames.indexOf(finishedGame);
        if (finishedGame == null || finishedGame == -1) return;
        global.RunningMTTGames.splice(index, 1);
        console.log('Ended Game!');
    }
}