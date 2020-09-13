const Canvas = require('canvas');
const Discord = require('discord.js');

module.exports = class {
    /**
     * @param {*} p1 Player 1
     * @param {*} p2 Player 2
     * @param {*} canvas 
     * @param {*} message Editable message with canvas
     */
    constructor(p1, p2, canvas) {
        this.p1 = p1;
        this.p2 = p2;
        this.canvas = canvas;
        this.current = p1;
        this.board = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];
    }

    play(message, player, v) {
        if (player == this.current) {
            if (this.board[v] != 'U') {
                message.reply('You cant overlap!Ya dum-dum');
                return;
            }
            this.board[v] = this.current == this.p1 ? 'X' : 'O';
            this.updateTexture(message);
            this.current = this.current == this.p1 ? this.p2 : this.p1;
            let p = this.checkWins();
            if (p) {
                message.reply(`${p} is the Winner`);
                return true;
            }
        } else {
            message.reply('It is not your turn!');
        }
        return false;
    }

    async updateTexture(message) {
        let ctx = this.canvas.getContext('2d');
        for (var i = 0; i < 9; i++) {
            if (this.board[i] != 'U') {
                let x = i % 3;
                let y = Math.floor(i / 3);
                ctx.drawImage(this.board[i] == 'X'
                ? await Canvas.loadImage('./textures/X.png') 
                : await Canvas.loadImage('./textures/O.png'), x * 200, y * 200, 200, 200);
            }
        }
        let attachment = new Discord.MessageAttachment(this.canvas.toBuffer(), 'moo-tac-toe.png');
        message.reply(attachment);
    }

    checkWins() {
        let checks = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let current of checks) {
            if (this.board[current[0]] == this.board[current[1]] && this.board[current[1]] == this.board[current[2]]
                && this.board[current[0]] != 'U') {
                return this.board[current[0]];
            }
        }
        return null;
    }
}