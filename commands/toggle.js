module.exports = {
    name: 'toggle',
    description: '',
    args: false,
    cooldown: 5,
    expected: '/toggle <arg>',
    execute(message, args) {
        if (args[0] == "vedban") {
            if (message.author == 490890757113380864) {
                global.vedBan = !global.vedBan;
                message.reply(global.vedBan ? "Ved has been stopped" : "I hope ved doesn't do it again");
            }
        }
    }
}