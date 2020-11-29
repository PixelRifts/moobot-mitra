module.exports = {
    name: 'play',
    description: '',
    args: true,
    cooldown: 2,
    expected: '/play [SuperSection] <Your Move>',
    execute(message, args) {
        var finishedGame;
        for (let game of global.RunningMTTGames) {
            if (game.p1 == message.author || game.p2 == message.author) {
                if (args.length == 1) {
                    if (!(args[0] > 0 && args[0] < 10)) {
                        message.reply("If you cant type a coordinate u suk.");
                        return;
                    }
                    if (game.play(message, message.author, args[0] - 1)) {
                        finishedGame = game;
                        break;
                    }
                } else {
                    let notnumbercheck = ((args[0] < 0 || args[0] > 10) || (args[1] < 0 || args[1] > 10));
                    if (notnumbercheck) {
                        message.reply('Type supersection and your move separated by a space');
                        return;
                    }
                    if (game.splay(message, message.author, args[0] - 1, args[1] - 1)) {
                        finishedGame = game;
                        break;
                    }
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