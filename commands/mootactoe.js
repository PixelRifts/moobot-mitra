const Helpers = require('../index.js');
const Canvas = require('canvas');
const Discord = require('discord.js');
const Mootacgame = require('../objects/mootacgame.js');

var RunningGames = [];

function line(ctx, x1, y1, x2, y2) {
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
        for (let game of RunningGames) {
            if (message.author == p1 || message.author == p2)
                message.reply(`${message.author} is playing another game`);
                
            else if (Helpers.parseMention(args[0]) == p1 || Helpers.parseMention(args[0]) == p2)
                message.reply(`${Helpers.parseMention(args[0])} is playing another game`);
        }
        let canvas = Canvas.createCanvas(600, 600);
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(1, 1, 1, 1)'
        line(ctx, 0, 0, 0, 600);
        line(ctx, 200, 0, 200, 600);
        line(ctx, 400, 0, 400, 600);
        line(ctx, 600, 0, 600, 600);
        line(ctx, 0, 0, 600, 0);
        line(ctx, 0, 200, 600, 200);
        line(ctx, 0, 400, 600, 400);
        line(ctx, 0, 600, 600, 600);
        let attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'moo-tac-toe.png');
        message.reply(attachment);

        RunningGames.push(new Mootacgame(message.author, Helpers.parseMention(args[0]), canvas));
    },

    games: RunningGames
}