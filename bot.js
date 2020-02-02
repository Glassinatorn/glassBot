const { config } = require('dotenv');
const { TextChannel, WebhookClient, Client, RichEmbed } = require('discord.js');

const client = new Client ({
    disableeveryone: true
});

config({
    path: __dirname + '/.token'
})

client.on('ready', () => {
    console.log("glassBot logged in!");
})

clean = (msg) => {
    const filter = m => m.content.includes('c');
    const collector = msg.channel.createMessageCollector(filter, {time: 15000});
    msg.channel.fetchMessages({limit: 100})
        .then(messages => {
            var tmp = messages.array();
            var toDelete = [];
            for(key in tmp) {
                if (tmp[key].content === 'c' ||
                    tmp[key].content === 'clean' ||
                    tmp[key].content === 'pling' ||
                    tmp[key].content === 'clean' ||
                    tmp[key].content.includes('!play') ||
                    tmp[key].content.includes('!clean') ||
                    tmp[key].content.includes('!stop') ||
                    tmp[key].content.includes('!resume') ||
                    tmp[key].content.includes('!replay') ||
                    tmp[key].content.includes('^play') ||
                    tmp[key].content.includes('^clean') ||
                    tmp[key].content.includes('^stop') ||
                    tmp[key].content.includes('^resume') ||
                    tmp[key].content.includes('^replay') ||
                    tmp[key].author.username === 'glassbot' ||
                    tmp[key].author.username === 'Yui')
                {
                    toDelete.push(tmp[key].id);
                    console.log(tmp[key].content);
                    console.log(tmp[key].author.username);
                }
            }
            msg.channel.bulkDelete(toDelete, true)
                .then(console.log('Deleted messages'))
                .catch(console.error);
        })
        .catch(console.error);

    // placeholder for what to send back
    return collector.size;
}

client.on('message', msg => {
    if (msg.content === "ping") {
        msg.reply('pong');
    } else if (msg.content === 'embed') {
        const embed = new RichEmbed()
            .setTitle('A slick little embed')
            .setColor(0xFF0000)
            .setDescription('testing');
        msg.channel.send(embed);
    } else if (msg.content === 'c') {
        if (msg.channel.type === 'text') {
            clean(msg);
        } else {
            msg.reply('Not a channel I can clean');
        }
    }
});

client.login(process.env.botToken);
const hook = new WebhookClient(process.env.hookID, process.env.hookToken);
