const Helpers = require('../index.js');
const Canvas = require('canvas');
const Discord = require('discord.js');
const Mootacgame = require('../objects/mootacgame.js');

global.RunningMTTGames = [];

function line(ctx, x1, y1, x2, y2, w) {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

module.exports = {
    name: 'mootactoe',
    description: 'Play Moo-Tac-Toe TM',
    aliases: ['mtt'],
    args: true,
    cooldown: 10,
    expected: '/mootactoe <Tag other Player>',
    execute(message, args) {
        for (let game of global.RunningMTTGames) {
            if (message.author == p1 || message.author == p2)
                message.reply(`${message.author} is playing another game`);
            else if (Helpers.parseMention(args[0]) == p1 || Helpers.parseMention(args[0]) == p2)
                message.reply(`${Helpers.parseMention(args[0])} is playing another game`);
        }
        let canvas = Canvas.createCanvas(450, 450);
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'white';

        for (let i = 0; i <= 450; i += 450 / 9) {
            let lw = i % 3 == 0 ? 6 : 1;
            line(ctx, i, 0, i, 450, lw);
            line(ctx, 0, i, 450, i, lw);
        }

        let attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'moo-tac-toe.png');
        message.reply(attachment);

        global.RunningMTTGames.push(new Mootacgame(message.author, Helpers.parseMention(args[0]), canvas));
    }
}