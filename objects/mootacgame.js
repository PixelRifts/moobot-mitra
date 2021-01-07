const Canvas = require('canvas');
const Discord = require('discord.js');

let sstart = [
    0, 3, 6,
    27, 30, 33,
    54, 57, 60
]

function getIndexWithinSupersection(s, v) {
    return sstart[s] + v % 3 + Math.floor(v / 3) * 9;
}

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
        this.board = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
                      'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
                      'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
                      'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
                      'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
                      'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
                      'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
                      'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U',
                      'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];

        this.superboard = ['U', 'U', 'U', 'U', 'U', 'U', 'U', 'U', 'U'];
        this.currentSupersection = -1;
    }

    splay(message, player, s, v) {
        if (player == this.current) {
            if (this.superboard[s] != 'U') {
                message.reply(`The supersection is already won by ${this.superboard[s]}`);
                return;
            }
            if (this.board[getIndexWithinSupersection(s, v)] != 'U') {
                message.reply('You cant overlap! Ya dum-dum');
                return;
            }

            if (this.currentSupersection != -1) {
                message.reply('You cannot specify the supersection when you are forced in one');
                return;
            }

            this.board[getIndexWithinSupersection(s, v)] = this.current == this.p1 ? 'X' : 'O';
            this.updateTexture(message);
            this.current = this.current == this.p1 ? this.p2 : this.p1;

            let t = this.updateSuperboard();
            let w = this.checkWinsWithinSupersection(s);
            if (w == null) {
                if (this.checkWinsWithinSupersection(v)) this.currentSupersection = -1;
                else this.currentSupersection = v;
            }
            else this.currentSupersection = -1;
            
            let p = this.checkWins();

            if (p) {
                if (p == 'U') {
                    message.reply(`The match was a tie`);
                    return true;
                }
                message.reply(`${p} is the Winner`);
                return true;
            }

        } else {
            message.reply('It is not your turn!');
        }
        return false;
    }

    play(message, player, v) {
        if (player == this.current) {
            if (this.board[getIndexWithinSupersection(this.currentSupersection, v)] != 'U') {
                message.reply('You cant overlap! Ya dum-dum');
                return;
            }

            if (this.currentSupersection == -1) {
                message.reply('Please provide the supersection as well as the place within that supersection');
                return;
            }

            this.board[getIndexWithinSupersection(this.currentSupersection, v)] = this.current == this.p1 ? 'X' : 'O';
            this.updateTexture(message);
            this.current = this.current == this.p1 ? this.p2 : this.p1;
            let t = this.updateSuperboard();
            
            let w = this.checkWinsWithinSupersection(this.currentSupersection);
            if (w == null) {
                if (this.checkWinsWithinSupersection(v)) this.currentSupersection = -1;
                else this.currentSupersection = v;
            }
            else this.currentSupersection = -1;

            let p = this.checkWins();

            if (p) {
                if (p == 'U') {
                    message.reply(`The match was a tie`);
                    return true;
                }
                message.reply(`${p} is the Winner`);
                return true;
            }

        } else {
            message.reply('It is not your turn!');
        }
        return false;
    }

    updateSuperboard() {
        let ret = -1;
        for (let i = 0; i < 9; i++) {
            let r = this.checkWinsWithinSupersection(i);
            this.superboard[i] = r == null ? 'U' : r;
        }
        return ret;
    }

    async updateTexture(message) {
        let ctx = this.canvas.getContext('2d');
        for (let i = 0; i < 81; i++) {
            if (this.board[i] != 'U') {
                let x = i % 9;
                let y = Math.floor(i / 9);
                console.log()
                ctx.drawImage(this.board[i] == 'X'
                    ? await Canvas.loadImage('./textures/X.png') 
                    : await Canvas.loadImage('./textures/O.png'), x * 50, y * 50, 50, 50);
            }
        }
        for (let i = 0; i < 9; i++) {
            if (this.superboard[i] != 'U') {
                let x = i % 3;
                let y = Math.floor(i / 3);
                ctx.drawImage(this.superboard[i] == 'X'
                    ? await Canvas.loadImage('./textures/X.png')
                    : await Canvas.loadImage('./textures/O.png'), x * 150, y * 150, 150, 150);
            }
        }
        let attachment = new Discord.MessageAttachment(this.canvas.toBuffer(), 'moo-tac-toe.png');
        message.reply(attachment);
    }

    checkWinsWithinSupersection(s) {
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
            if (this.board[getIndexWithinSupersection(s, current[0])] == this.board[getIndexWithinSupersection(s, current[1])]
                    && this.board[getIndexWithinSupersection(s, current[1])] == this.board[getIndexWithinSupersection(s, current[2])]
                    && this.board[getIndexWithinSupersection(s, current[0])] !== 'U') {
                return this.board[getIndexWithinSupersection(s, current[0])];
            }
        }
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === 'U') {
                return null;
            }
        }
        return 'U';
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
            if (this.superboard[current[0]] == this.superboard[current[1]] && this.superboard[current[1]] == this.superboard[current[2]]
                && this.superboard[current[0]] !== 'U') {
                return this.superboard[current[0]];
            }
        }
        for (let i = 0; i < 9; i++) {
            if (this.superboard[i] === 'U') {
                return null;
            }
        }
        return 'U';
    }
}